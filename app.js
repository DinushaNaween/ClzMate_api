const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
//const { MongoClient } = require('mongodb');

const clzRoutes = require('./api/routes/clzes');
const paperRoutes = require('./api/routes/papers');
const userRoutes = require('./api/routes/user');

// async function run() {
//     const client = await MongoClient.connect('mongodb://localhost:27017/ClzMate');
//     const db = client.db('ClzMate');
//     console.log('database conection OK');
// }

mongoose.connect('mongodb://localhost:27017/ClzMate');

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(passport.initialize());
app.use(passport.session());

//require('./config/passport')(passport);

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE')
        return res.status(200).json({});
    }
    next();
});

app.use('/clzes', clzRoutes);
app.use('/papers', paperRoutes);
app.use('/user', userRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;