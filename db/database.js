const mongo = require("mongodb").MongoClient;
const config = require("../config.json");

// change to docs for assignment
const collectionName = "docs";

const database = {
    getDb: async function getDb () {

        // MongoDB Atlas
        let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.0qmae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
        // let dsn = "mongodb://localhost:27017/test";
        // Test db
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
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

module.exports = database;
