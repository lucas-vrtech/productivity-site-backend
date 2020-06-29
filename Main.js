const express     = require('express');
const app         = express();
const path        = require('path');
const mysql       = require('mysql');
const session     = require('express-session');
const MySQLStore  = require('express-mysql-session')(session);
const Router      = require('./Router');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

console.log('Testing Server');

//database
const db = mysql.createConnection({
  host: 'localhost',
user: 'root',
  password: 'root',
  database: 'myapp'
});