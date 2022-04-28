const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/databasepg");

router.get("/", (req, res) => {
    res.render("register.ejs");
});

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return res.redirect('/');
//     }
//     next();
//   }

// router.get('/register', checkNotAuthenticated, (req, res) => {
//     res.render("register.ejs");
// });
  
const users = []  // need to be stored in DB in the future

router.post('/', async (req, res) => {
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { email } = req.body;

    console.log('USER: ',req.body.email, hashedPassword)
    console.log('email ', email)
    
    const newUser = await pool.query(
        "INSERT INTO user (email, password) VALUES($1, $2) RETURNING *",
        [email, hashedPassword]
    );

    // users.push({
    // id: Date.now().toString(),
    // name: req.body.name,
    // email: req.body.email,
    // password: hashedPassword
    // });

    res.redirect('/login');
} catch (error) {
    console.log(error);
    res.redirect('register');
}
console.log(users);
});

module.exports = router;