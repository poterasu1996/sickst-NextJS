// const mongoose = require("mongoose");

// const CategorySchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true, dropDups: true }
// });
const pool = require('../config/databasepg');

const createCategory = async (query) => {
    await pool.query(query);  // sends queries
}

module.exports = createCategory;