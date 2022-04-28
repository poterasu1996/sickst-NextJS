const express = require("express");
const router = express.Router();
const { pool } = require('../config/databasepg');
const verify = require('./privateRoutes');

router.post('/', async(req, res) => {
    try {
        const { product_id, user_id, product_rating, review} =  req.body;
        const newReview = await pool.query(`
            INSERT INTO "review" (product_id, user_id, product_rating, review) 
            VALUES($1, $2, $3, $4)
            RETURNING *`,
            [product_id, user_id, product_rating, review]);
        
        res.json(newReview.rows)
    } catch (error) {
        console.error(error.message);
    } 
});

router.get('/', verify, async(req, res) => {
    try {
        const allReviews = await pool.query(`
            SELECT * FROM "review"
        `);
        res.json(allReviews.rows);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;