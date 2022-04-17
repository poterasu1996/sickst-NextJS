const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const pool = require("./config/databasepg");

// Middleware
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

// Routes
// insert a category
app.post("/category", async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO category (name) VALUES($1) RETURNING *",
      [name]
    );

    res.json(newCategory);
  } catch (error) {
    console.error(error.message);
  }
});

// get all categories
app.get("/category", async(req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM category");
    res.json(allCategories.rows);
  } catch (error) {
    console.error(error.message);
  }
})

// get a category
app.get("/category/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const category = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
    res.json(category.rows);
  } catch (error) {
    console.error(error.message); 
  }
})

// update a category
app.put("/category/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateCategory = await pool.query("UPDATE category SET name = $1 WHERE id = $2", [name, id]);

    res.json("Category updated.");
  } catch (error) {
    console.error(error.message);
  }
})

// delete a category
app.delete("/category/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await pool.query("DELETE FROM category WHERE id = $1", [id]);

    res.json("Category deleted");
  } catch (error) {
    console.error(error.message);
  }
})

// Logging - only for dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars - optional if we work with React
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "sddasdasd",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./api/index"));

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
