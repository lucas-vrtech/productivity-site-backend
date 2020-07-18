const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const userdb = require('./userdb');
const port = process.env.PORT || 3000;
const app = express();

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = userdb.db;
const store = KnexSessionStore({
  knex,
  tablename: 'sessions'
});

app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


app.use(session({
  key: 'dfgl',
  secret: 'wret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (1825 * 86400 * 1000),
    //httpOnly: false
    //domain: 'u6527.csb.app'
    secure: false
  }
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
  console.log("Getted");
});

app.post('/login', (req, res) => {
  //console.log("SESSION ID: " + req.session.id);
  let username = req.body.username;
  let password = req.body.password;

  let cols = [username];
  userdb.getUserByName(username).then(user => {
    if (user){
      bcrypt.compare(password, user.password, (bcryptErr, verified) => {
        if (verified) {
          req.session.userID = user.id;
          req.session.save();
          //console.log("User Found: " + JSON.stringify(user));
          //console.log("Saved: " + JSON.stringify(req.session));
          res.json({
            success: true,
            username: user.username
          });

          return;
        }
        else{
          res.json({
            success: false,
            msg: 'Invalid Password'
          });
          //console.log("Invalid Password for " + user.username);
          return;
        }

      });
    }
    else {
      res.json({
            success: false,
            msg: 'User not found, please try again'
          });
          //console.log("User Not Found");
          return;
    }
  })
  .catch(err => {
    res.json({
      success: false,
      msg: 'An error occurred. Please try again.'
    });
    console.log("SQL err: " + err);
    return;
  });
  //console.log("GOT REQUEST: " + req.body.username);
});

app.post('/signup', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let cols = [username];
  userdb.getUserByName(username).then(user => {
    if (user){
          res.json({
            success: false,
            msg: 'Account already exists'
          });
          //console.log("Account already exists!");
          return;
    }
    else {
      userdb.addUser(username, password).then(id => {
      //console.log("ID CREATED: " + id);
      req.session.userID = id;
      req.session.save();
      res.json({
            success: true,
            username: username
          });
          //console.log("Account Created");
          return;
      }).catch(err => {
        res.json({
          success: false,
          msg: 'An error occurred. Please try again.'
        });
        console.log("err: " + err);
        return;
      });
    } 
  })
  .catch(err => {
    res.json({
      success: false,
      msg: 'An error occurred. Please try again.'
    });
    console.log("SQL err: " + err);
    return;
  });
  //console.log("GOT REQUEST: " + req.body.username);
});

app.post('/logout', (req, res) => {
    if (req.session.userID != null){
      //console.log(req.session.userID + " logged out.");
      req.session.destroy()
      res.json({
        success: true
      });
      return true;

    }
    else{
      //console.log("Already logged out. " + JSON.stringify(req.session) + " ID: " + req.session.userID);
      res.json({
        success: false
      });

      return false;
    }
});


app.post('/isLoggedIn', (req, res) => {
    if (req.session.userID != null){
      let cols = [req.session.userID];
      userdb.getUserById(req.session.userID).then(user => {
        if (user){
          res.json({
            success: true,
            username: user.username
          });
          //console.log(user.username + " is logged in.");
          return true;
        }
        else{
          res.json({
            success:false
          });
        }
    });
  }
  else
  {
    res.json({
      success:false
    });
    //console.log("NO USER ID!");
    return;
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
