const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
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
  
router.post('/register', async (req, res) => {
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
    });

    res.redirect('/login');
} catch (error) {
    console.log(error);
    res.redirect('register');
}
console.log(users);
});

module.exports = router;