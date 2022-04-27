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
    )
`;
const productTable = `
    CREATE TABLE IF NOT EXISTS "product" (
        "id" SERIAL,
        "brand" VARCHAR(100) NOT NULL,
        "model" VARCHAR(100) NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "price" INTEGER NOT NULL,
        "category_id" INTEGER REFERENCES category (id),
        "image_id" INTEGER REFERENCES image (id),

        PRIMARY KEY ("id")
    )
`;
const userTable = `
    CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL,
        "email" VARCHAR(100) NOT NULL,
        "password" VARCHAR(255) NOT NULL,

        PRIMARY KEY ("id")
    )
`;

function createTables() {
    pool.query(categoryTable)  // create category table
        .then(res => {
            console.log('Table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(imageTable)     // create image table
        .then(res => {
            console.log('Table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(productTable)   // create product table
        .then(res => {
            console.log('Table created');
        })
        .catch(e => console.error(e.stack));
    pool.query(userTable)      // create user table
        .then(res => {
            console.log('Table created');
        })
        .catch(e => console.error(e.stack));
}
 

// pool.query(`DROP TABLE user CASCADE;`);

// module.exports = {createTables};
module.exports = pool;