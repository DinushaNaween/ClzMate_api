const express = require('express');
const app = express();

const classRoutes = require('./api/routes/classes');
const pastpapersRoutes = require('./api/routes/pastpapers');

app.use('/classes', classRoutes);
app.use('/pastpapers', pastpapersRoutes);

module.exports = app;