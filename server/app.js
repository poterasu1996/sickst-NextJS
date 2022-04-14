const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const execute = require("./config/databasepg");
const bodyParser = require("body-parser");

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require('./config/passport')(passport)

// set a query to verify connection -- SUCCESS
// client.query(`CREATE TABLE IF NOT EXISTS category (
//   id INT,
//   name VARCHAR(50),
//   PRIMARY KEY ("id")
// )`, (err, res) => {
//     if(!err) {
//       console.log('res',res);
//     } else {
//       console.log('erroare',err);
//     }
// });

const text = `
  CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100),
    PRIMARY KEY ("id")
  );`;

execute(text).then(result => {
  if (result) {
    console.log('Table Created')
  }
  const text2 = `SELECT NOW() as now`
  execute(text2)
    .then(res => console.log(res))
    .catch(e => console.log(e.stack));
});



// Logging - only for dev
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// Handlebars - optional if we work with React
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'sddasdasd',
  resave: false,
  saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./api/index'));

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
