const {Client} = require("pg");

const client = new Client({
    host: "localhost",
    user: "admin",
    port: 5432,
    password: "admin",
    database: "sickst"
});

const execute = async (query) => {
    try {
        console.log('Making query')
        await client.connect();     // gets connection
        const res = await client.query(query);  // sends queries
        console.log('res',res);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        console.log('Ending DB')
        await client.end();
    }
}

module.exports = execute;