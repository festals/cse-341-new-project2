const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();



const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use((req, res, next) => {
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

mongodb.initDb((err) => {
    if(err) {
        console.error("MongoDB connection error:", err);
    }
    else {
        app.listen(port, () =>{console.log(`Database is listening and node Running on port ${port}`)});
    }
});