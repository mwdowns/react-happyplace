const express = require('express'),
bodyParser = require('body-parser'),
bcrypt = require('bcrypt'),
uuid = require('uuid'),
pgp = require('pg-promise')(),
dotenv = require('dotenv').config(),
index = require('./routes/index');

app = express();

app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', index);

module.exports = app;