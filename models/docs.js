const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const docs = {
    readAll: async function(req, res) {
        let db;

        try {
            db = await database.getDb();

            const resultSet = await db.collection.find({}).toArray();

            console.log(resultSet);
            return res.json(resultSet);
        } catch (err) {
            console.log(err);
            res.json(err);
    
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: err.message
                }
            });
        } finally {
            await db.client.close();
        }

    },
    readOne: async function(req, res) {
        let db;

        try {
            db = await database.getDb();

            // const filter = { _id: ObjectId(req.body["_id"]) };
            console.log("id: " + req.params.id);
            const filter = {_id: ObjectId(req.params.id)};

            const resultSet = await db.collection.find(filter).toArray();

            console.log(resultSet);
            return res.json(resultSet);
        } catch (err) {
            console.log(err);
            res.json(err);
    
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: err.message
                }
            });
        } finally {
            await db.client.close();
        }

    },
    addOne: async function(req, res) {
        let db;

        try {
            db = await database.getDb();

            let doc = {
                name: req.body.name,
                content: req.body.content
            }
        
            const resultSet = await db.collection.insertOne(doc);
    
            console.log(resultSet);
    
            if (resultSet.acknowledged) {
                return res.status(201).send(`Added an object with id ${resultSet.insertedId}`);
            }

            return res.json(resultSet);
        
        } catch (err) {
            console.log(err);
            res.json(err);
    
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: err.message
                }
            });
        } finally {
            await db.client.close();
        }

    },
    updateOne: async function (req, res) {
        let db;

        try {
            db = await database.getDb();

            // const filter = { _id: ObjectId(req.body._id) };
            const filter = { _id: ObjectId(req.body["_id"]) };
        
            console.log(req.body._id);
            const updateDocument = {
                $set: {
                    name: req.body.name,
                    content: req.body.content,
                }
            };

            options = { upsert: false };
        
            const resultSet = await db.collection.updateOne(filter, updateDocument, options);

            console.log(resultSet);
    
            if (resultSet.acknowledged) {
                return res.status(204).send();
            }

            return res.json(resultSet);
        
        } catch (err) {
            console.log(err);
            res.json(err);
    
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: err.message
                }
            });
        } finally {
            await db.client.close();
        }
    }

}

module.exports = docs;
