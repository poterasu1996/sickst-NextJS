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
const imageTable = `
    CREATE TABLE IF NOT EXISTS "image" (
        "id" SERIAL,
        "name" TEXT,
        "img" TEXT,

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
        "category_id" INTEGER REFERENCES "category" (id),
        "image_id" INTEGER REFERENCES "image" (id),

        PRIMARY KEY ("id")
    )
`;
const customerTable = `
    CREATE TABLE IF NOT EXISTS "customer" (
        "id" SERIAL,
        "email" VARCHAR(100) NOT NULL,
        UNIQUE (email),
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(50) DEFAULT 'customer',
        "create_date" DATE NOT NULL DEFAULT CURRENT_DATE,

        PRIMARY KEY ("id")
    );
`;

const reviewTable = `
    CREATE TABLE IF NOT EXISTS "review" (
        "id" SERIAL,
        "product_id" INTEGER REFERENCES "product" (id),
        "user_id" INTEGER references "user" (id),
        "product_rating" REAL,
        "review" TEXT,

        PRIMARY KEY ("id")
    ); 
`;

function createTables() {
    pool.query(categoryTable)  // create category table
        .then(res => {
            console.log('Category table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(imageTable)     // create image table
        .then(res => {
            console.log('Image table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(productTable)   // create product table
        .then(res => {
            console.log('Product table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(customerTable)      // create user table
        .then(res => {
            console.log('Customer table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(reviewTable)      // create review table
        .then(res => {
            console.log('Review table created');
        })
        .catch(e => console.error(e.stack));
}
 

// pool.query(`DROP TABLE user CASCADE;`);

module.exports = {createTables, pool};