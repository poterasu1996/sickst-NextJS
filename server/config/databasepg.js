const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    database: "sickst",
    user: "admin",
    password: "admin",
    port: 5432
});

const categoryTable = `
  CREATE TABLE IF NOT EXISTS "category" (
    "id" SERIAL,
    "name" VARCHAR(100) NOT NULL,
    UNIQUE (name),
    PRIMARY KEY ("id")
    );
`;

const productTable = `
    CREATE TABLE IF NOT EXISTS "product" (
        "id" SERIAL,
        "brand" VARCHAR(100) NOT NULL,
        "model" VARCHAR(100) NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "price" INTEGER NOT NULL,
        "category_id" INTEGER REFERENCES category (id),

        PRIMARY KEY ("id")
    )
`;
const userTable = `
    CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL,
        "email" VARCHAR(100) NOT NULL,
        "password" VARCHAR(100) NOT NULL,

        PRIMARY KEY ("id")
    )
`;

pool.query(categoryTable);  // create category table
pool.query(productTable);  // create product table
pool.query(userTable);  // create user table

// pool.query(`DROP TABLE category CASCADE;`);

module.exports = pool;