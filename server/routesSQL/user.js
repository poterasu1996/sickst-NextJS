const express = require("express");
const router = express.Router();
const { pool } = require("../config/databasepg");

router.get('/', async(req, res) => {
    try {
        const users = await pool.query(
            `SELECT * FROM "customer";`
        );
        res.json(users.rows);
    } catch (error) {
        console.error(error.message);        
    }
});

module.exports = router;