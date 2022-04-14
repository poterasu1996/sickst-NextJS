const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Load config
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();


// Logging - only for dev
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// Handlebars - optional if we work with React
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/Category'));

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
