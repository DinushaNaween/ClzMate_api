const express = require('express');
const app = express();
const morgan = require('morgan');

const classRoutes = require('./api/routes/classes');
const pastpapersRoutes = require('./api/routes/pastpapers');

app.use(morgan('dev'));

app.use('/classes', classRoutes);
app.use('/pastpapers', pastpapersRoutes);

module.exports = app;