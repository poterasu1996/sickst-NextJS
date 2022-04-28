if (process.env.NODE_ENV === "development") {
  require('dotenv').config();
  // app.use(morgan("dev"));
}

const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const pool = require("./config/databasepg");
// const { pool, createTables } = require("./config/databasepg");
const jwt = require("jsonwebtoken");
const methodOverride = require("method-override");

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create tables
// createTables();

// Load config
// dotenv.config({ path: "./config/config.env" });

// Passport config
// require("./config/passport")(passport);


// const posts = [
//   {
//     username: 'Kayle',
//     title: 'Post 1'
//   },
//   {
//     username: 'Doe',
//     title: 'Post 2'
//   }
// ]

// test JWT
// app.get('/posts', authenticateToken, (req, res) => {
//   res.json(posts.filter(post => post.username === req.user.name))
// })

// app.post('/login', (req, res) => {
//   // Authenticate user

//   const username = req.body.username;
//   const user = { name: username };

//   console.log('username', username);
//   console.log('user', user);

//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//   res.json({ accessToken: accessToken })
// })

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token === null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user
//     next();
//   })
// }

const initializePassport = require('./passport-config');
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);
// const users = []  // need to be stored in DB in the future

// optional if we work with React
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); // this allows us to access form fields 
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());  // persist to the entire session
app.use(methodOverride('_method'));


app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
})
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
const category =  require('./routes/category');
app.use('/category', category);

const register = require('./routes/register');
app.use('/register', register);
// app.use("/", require("./routes/index"));
// app.use("/login2", require("./routes/login"));

// app.use("/api", require("./api/index"));

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
