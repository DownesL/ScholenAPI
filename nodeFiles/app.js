const express = require('express');
const morgan = require('morgan');

const mainRoutes = require('./mainRoutes')

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next) => {
    req.requestTime = new Date().toLocaleDateString();
    next();
});

app.use('/',mainRoutes)
module.exports = app;