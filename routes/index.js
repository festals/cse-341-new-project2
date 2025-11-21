const passport = require('passport');
const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send("Hello World!")
});

router.use('/members', require('./members'));

router.use('/users', require('./users'));

router.get('/github', passport.authenticate('github'), (req, res) => {});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        req.session.user = user;
        req.session.save((err) => { // Explicitly save session
            if (err) {
                console.error("Local login session save error:", err); // Debugging log
                return next(err);
            }
            console.log("Local login successful, session set:", req.session); // Debugging log
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err);}
        res.redirect('/');
    });
});

module.exports = router;