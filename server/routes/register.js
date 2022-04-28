const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../config/databasepg");

// router.get("/", (req, res) => {
//     res.render("register.ejs");
// });

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
}

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

router.post('/', async (req, res) => {
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { email } = req.body;

    console.log('USER: ',req.body.email, hashedPassword)
    console.log('email ', email)
    
    const newUser = await pool.query(
        `INSERT INTO "user" (email, password) VALUES($1, $2) RETURNING *`,
        [email, hashedPassword]
    );

    res.redirect('/login');
} catch (error) {
    console.log(error);
    res.redirect('register');
}
});

module.exports = router;