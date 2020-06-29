const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, world!');
  console.log();
});

app.listen(8080);
