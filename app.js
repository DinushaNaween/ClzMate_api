const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const clzRoutes = require('./api/routes/clz');
const paperRoutes = require('./api/routes/paper');
const userRoutes = require('./api/routes/user');
const markRoutes = require('./api/routes/mark');

// mongoose.connect('mongodb://admin:admin123@ds028559.mlab.com:28559/clzmate');
mongoose.connect('mongodb://localhost:27017/ClzMate');

mongoose.Promise = global.Promise;
 
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/clz', clzRoutes);
app.use('/paper', paperRoutes);
app.use('/user', userRoutes);
app.use('/mark', markRoutes);

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