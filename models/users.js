const database = require("../db/dbusers.js");
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcryptjs");

const users = {
    getAll: async function getAll(
        res=undefined,
    ) {
        let db;

        try {
            db = await database.getDb();

            let result = await db.collection.find({}).toArray();

            if (res === undefined) {
                return result;
            }

            return res.json({
                data: result
            });
        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            });
        } finally {
            await db.client.close();
        }
    },
    readAll: async function (res) {
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
    getAllowedUsers: async function(res) {
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
    findOne: async function(email) {
        let db;

        try {
            db = await database.getDb();

            const filter = {email: email};

            const user = await db.collection.findOne(filter);

            // console.log(user);

            return user;
        } catch (err) {
            return "Error";
        } finally {
            await db.client.close();
        }
    },
    addUser: async function(req, res) {
        let db;

        try {
            db = await database.getDb();

            if (!req.body.email || !req.body.password) {
                return res.status(200).json({
                    data: {
                        source: "/register",
                        title: "Email or password missing.",
                        message: "Email or password missing."
                    }
                });
            }

            const filter = {email: req.body.email};

            const findUser = await db.collection.findOne(filter);

            // console.log(findUser.email);

            if (findUser !== null) {
                return res.status(200).json({
                    data: {
                        title: "User already exists.",
                        message: `${findUser.email} already exists.`
                    }
                });
            }

            if (findUser == null) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                let user = {
                    email: req.body.email,
                    password: hashedPassword,
                    docs: [],
                    // allowed_users: [req.body.email]
                };

                await db.collection.insertOne(user);

                return res.status(201).json({
                    data: {
                        title: `Succesfully created a user.`,
                        message: `Succesfully created a user.`,
                        created_email: `${user.email}`
                    }
                });
            }
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
    updateUserPassword: async function (req, res) {
        // req contains user object set in checkToken middleware
        if (req.body._id) {
            let _id = req.body._id;
            let filter = {
                "_id": ObjectId(_id)
            };
            let db;

            try {
                db = await database.getDb();

                const updateUser = {
                    $set: {
                        password: req.body.password,
                    }
                };

                let options = { upsert: false };

                await db.collection.updateOne(filter, updateUser, options);

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
                    // console.log(allAuthedUsers);
                }

                // const allUsers = resultSet.data.email;

                // const resultSet = await db.collection.find(filter).toArray();

                // let currentUser = resultSet.find(x => x);

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

                // console.log(allDocs);
                // console.log(newDoc);

                allDocs.push(newDoc);
                // console.log(allDocs);

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
    },
    deleteDoc: async function (req, res) {
        // req contains user object set in checkToken middleware
        if (req.body._id) {
            let _id = req.body._id;
            let filter = {
                "docs._id": ObjectId(_id)
            };
            let db;

            try {
                db = await database.getDb();

                await db.collection.deleteOne(filter);

                return res.status(200).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "DELETE /data DELETE",
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
                    path: "DELETE /data no id",
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    },
    deleteOne: async function (req, res) {
        // req contains user object set in checkToken middleware
        if (req.body._id) {
            let _id = req.body._id;
            let filter = {
                "_id": ObjectId(_id)
            };
            let db;

            try {
                db = await database.getDb();

                await db.collection.deleteOne(filter);

                return res.status(200).send();
            } catch (e) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        path: "DELETE /data DELETE",
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
                    path: "DELETE /data no id",
                    title: "No id",
                    message: "No data id provided"
                }
            });
        }
    }
};

module.exports = users;
