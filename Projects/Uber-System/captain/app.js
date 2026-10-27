const express = require('express');
const captainRoutes = require('./routes/captain.routes');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const connect = require('./db/db')

const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use('/', captainRoutes)

module.exports = app;