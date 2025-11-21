const express = require('express');
const connectDB = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const app = express();
const { User } = require('./models/users');
const bcrypt = require('bcryptjs');


const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())

    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, 2-key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })

    .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'], origin: '*' }));

app.use('/', require('./routes'));

passport.use(new GithubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
    }, 
        async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
                if  (profile._json.email != undefined){
                    let password = "githubUser1";
                    let hashedpassword = await bcrypt.hash(password, 10);
                    
                    user = new User({
                        githubId: profile.id,
                        email: email.profile,
                        username: profile.username,
                        password: hashedpassword,
                        admin: false
                    });
                    await user.save();
                    console.log("User saved to MongoDB:", user); // Log to confirm user is saved
                } else {
                    console.log("name is undefined");
                }
            }
            return done(null, user);
        } catch (err) {
            console.error("Error saving user:", err); // Log the error
            return done(err);
        }
    }
));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect Username' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect Password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`Logged in as ${req.session.user.username}`);
    } else {
        res.send('Logged Out');
    }
});


app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
(req, res) => {
    console.log('User:', req.user);
    req.session.user = req.user;
    console.log('Session after setting user:', req.session);
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}), 
(req, res) => {
    console.log('User:', req.user);
    req.session.user = req.user;
    console.log('Session after setting user:', req.session);
    res.redirect('/');
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught Exception: ${err}\nException Origin: ${origin}`);
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});