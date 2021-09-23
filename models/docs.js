const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const docs = {
    readAll: async function(res) {
        let db;

        try {
            db = await database.getDb();

            const resultSet = await db.collection.find({}).toArray();

            return res.status(200).json({
                data: resultSet
            });
        } catch (err) {
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
    readOne: async function(id, res) {
        let db;

        try {
            db = await database.getDb();

            const filter = {_id: ObjectId(id)};

            const resultSet = await db.collection.find(filter).toArray();

            return res.status(200).json({
                data: resultSet
            });
        } catch (err) {
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
            };

            const resultSet = await db.collection.insertOne(doc);

            return res.status(201).json({
                data: {
                    message: `Succesfully created a document.`,
                    created_id: `${resultSet.insertedId}`
                }
            });
        } catch (err) {
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
        // req contains user object set in checkToken middleware
        if (req.body._id) {
            let _id = req.body._id;
            let filter = {
                "_id": ObjectId(_id)
            };
            let db;

            try {
                db = await database.getDb();

                const updateDocument = {
                    $set: {
                        name: req.body.name,
                        content: req.body.content,
                    }
                };

                let options = { upsert: false };

                await db.collection.updateOne(filter, updateDocument, options);

                return res.status(204).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "PUT /data UPDATE",
                        title: "Database error",
                        message: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "PUT /data no id",
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    },
    updateFromSocket: async function (req) {
        // req contains user object set in checkToken middleware
        if (req._id) {
            let _id = req._id;
            let filter = {
                "_id": ObjectId(_id)
            };
            let db;

            try {
                db = await database.getDb();

                const updateDocument = {
                    $set: {
                        name: req.name,
                        content: req.html,
                    }
                };

                let options = { upsert: false };

                await db.collection.updateOne(filter, updateDocument, options);

                return "Success!!";
            } catch (e) {
                return "Error!";
            } finally {
                await db.client.close();
            }
        } else {
            return "Error, no id provided!";
        }
    }
};

module.exports = docs;
