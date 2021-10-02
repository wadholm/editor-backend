const mongo = require("mongodb").MongoClient;

let config;
let dsn;

if (process.env.NODE_ENV !== 'test') {
    config = require("../config.json");
}

// change to docs for assignment
// const collectionName = "docs";
const collectionName = "users";

const dbusers = {
    getDb: async function getDb() {
        // Test db
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        } else {
            // MongoDB Atlas
            dsn = `mongodb+srv://${config.username}:${config.password}` +
            `@cluster0.0qmae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = dbusers;
