const database = require("../db/dbusers.js");
const ObjectId = require('mongodb').ObjectId;

const docs = {
    getAllowedDocs: async function(email, res) {
        let db;

        try {
            db = await database.getDb();

            const filter = { "docs.allowed_users": email };


            const resultSet = await db.collection.find(filter).toArray();
            let returnData;

            let receivedData = Object.values(resultSet);

            returnData = receivedData.map(a => a.docs);
            const concatDocs = [].concat.apply([], returnData);

            return res.status(200).json({
                data: concatDocs
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
    addDoc: async function (req, res) {
        // req contains user object set in checkToken middleware
        if (req.body.email) {
            let db;

            try {
                db = await database.getDb();

                const filter = {email: req.body.email};
                const currentUser = await db.collection.findOne(filter);

                const resultSet = await db.collection.find({}).toArray();

                let receivedDocs = Object.values(resultSet);

                let allAuthedUsers = [];

                for (const nestedArrayOfDocs of receivedDocs) {
                    allAuthedUsers.push(nestedArrayOfDocs.email);
                }

                let allowedUsers = [ currentUser.email ];

                if (req.body.allowed_users) {
                    let optionalUsers = req.body.allowed_users.split(", ");

                    optionalUsers.forEach((user) => {
                        if (allAuthedUsers.includes(user) === true) {
                            allowedUsers.push(user);
                        }
                    });
                }

                let allDocs = currentUser["docs"];

                let newDoc = {
                    _id: ObjectId(),
                    name: req.body.name,
                    content: req.body.content,
                    allowed_users: allowedUsers
                };

                allDocs.push(newDoc);

                const addDoc = {
                    $set: {
                        docs: allDocs
                    }
                };

                let options = { upsert: false };

                await db.collection.updateOne(filter, addDoc, options);


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
                    path: "PUT /data no email",
                    title: "No id",
                    message: "No data email provided"
                }
            });
        }
    },
    updateDoc: async function (req, res) {
        // req contains user object set in checkToken middleware
        if (req.body._id) {
            let _id = req.body._id;
            let db;

            try {
                db = await database.getDb();

                // check if allowed_users are all registered users
                const resultSet = await db.collection.find({}).toArray();

                let receivedDocs = Object.values(resultSet);
                let allAuthedUsers = [];

                for (const nestedArrayOfDocs of receivedDocs) {
                    allAuthedUsers.push(nestedArrayOfDocs.email);
                }

                let allowedUsers = [];

                if (req.body.allowed_users) {
                    let optionalUsers = req.body.allowed_users.split(", ");

                    optionalUsers.forEach((user) => {
                        if (allAuthedUsers.includes(user) === true) {
                            allowedUsers.push(user);
                        }
                    });
                }

                let options = { upsert: false };

                await db.collection.updateOne({"docs._id": ObjectId(_id)},
                    {$set: {
                        "docs.$.name": req.body.name,
                        "docs.$.content": req.body.content,
                        "docs.$.allowed_users": allowedUsers,
                    }}, options);
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
            let db;

            try {
                db = await database.getDb();

                const resultSet = await db.collection.find({}).toArray();

                let receivedDocs = Object.values(resultSet);
                let allAuthedUsers = [];

                for (const nestedArrayOfDocs of receivedDocs) {
                    allAuthedUsers.push(nestedArrayOfDocs.email);
                }

                let allowedUsers = [];

                if (req.allowed_users) {
                    let optionalUsers = req.allowed_users.split(", ");

                    optionalUsers.forEach((user) => {
                        if (allAuthedUsers.includes(user) === true) {
                            allowedUsers.push(user);
                        }
                    });
                }

                let options = { upsert: false };

                await db.collection.updateOne({"docs._id": ObjectId(_id)},
                    {$set: {
                        "docs.$.name": req.name,
                        "docs.$.content": req.content,
                        "docs.$.allowed_users": allowedUsers,
                    }}, options);

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
