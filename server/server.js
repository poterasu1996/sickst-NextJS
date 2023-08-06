// it is good practice to have everything that is related with the server, and not to express
// in a separated file
// so this will be the main entry point, not app
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// this is how we config nodeJS with custom env variable
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB connection successful");
  });


// if we want to preset an env variable, we can use it in terminal
// ex: NODE_ENV=development test=23 nodemon server.js
// this will set NODE_ENV and test in .env file

// 4) ---- start server ----
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
