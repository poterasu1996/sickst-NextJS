const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../config/databasepg");
const {authValidation} = require("../validation");
const jwt = require("jsonwebtoken");


router.post('/register', async (req, res) => {
    // Form validation
    const { error } = authValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create a new user
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const { email } = req.body;
    
        console.log('USER: ',req.body.email, hashedPassword)
        console.log('email ', email)
        
        const newUser = await pool.query(
            `INSERT INTO "customer" (email, password) VALUES($1, $2) RETURNING *`,
            [email, hashedPassword]
        ).then(res => res.send('User Registered'))
        .catch(e => res.status(404).send('Already registered!'));
  
    } catch (error) {
        console.log(error);
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // Form validation
    const { error } = authValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // check if email exists
        const userExist = await pool.query(
            `SELECT * FROM "customer" WHERE email = $1;`,
            [req.body.email]
        );

        if(!userExist.rows[0]) return res.status(400).send('Email or password is wrong!');

        // If password is correct
        // console.log(userExist.rows[0])
        const validPW = await bcrypt.compare(req.body.password, userExist.rows[0].password)

        if(!validPW) return res.status(400).send('Invalid password!');
        // continue with login

        // Create and assign a JWT
        const token = jwt.sign({ username: userExist.rows[0].email }, process.env.ACCESS_TOKEN_SECRET);
        res.header('jwt-token', token).send(token);

    } catch (error) {
        res.send(error);
    }
});

module.exports = router;