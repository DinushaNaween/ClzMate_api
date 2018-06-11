const express = require('express');
const app = express();

const classRoutes = require('./api/routes/classes');

app.use('/classes', classRoutes);

module.exports = app;