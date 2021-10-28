/* global it describe before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

const database = require("../db/dbusers.js");
const collectionName = "users";
// let email = "";
let _id = "";

chai.use(chaiHttp);

describe('Users', () => {
    before(() => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('Users model', () => {
        describe('GET /users', () => {
            it('200 HAPPY PATH for users', (done) => {
                chai.request(server)
                    .get("/users")
                    .end((err, res) => {
                        // console.log(res);
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        res.body.data.should.be.an("array");
                        res.body.data.length.should.be.above(0);

                        done();
                    });
            });
        });

        it('should get 201 adding a user', (done) => {
            let testUser = {
                email: "user1@test.com",
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Succesfully created a user.");
                    // email = res.body.data.created_email;
                    res.body.data.created_email.should.equal(testUser.email);
                    done();
                });
        });
        it('should get 201 adding a second user', (done) => {
            let testUser = {
                email: "user2@test.com",
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Succesfully created a user.");
                    // email = res.body.data.created_email;
                    res.body.data.created_email.should.equal(testUser.email);
                    done();
                });
        });
        it('should get 201 adding a third user', (done) => {
            let testUser = {
                email: "user3@test.com",
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Succesfully created a user.");
                    // email = res.body.data.created_email;
                    res.body.data.created_email.should.equal(testUser.email);
                    done();
                });
        });
        it('should get warning for missing email', (done) => {
            let testUser = {
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Email or password missing.");
                    done();
                });
        });
        it('should get warning for user already exists', (done) => {
            let testUser = {
                email: "user1@test.com",
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal(`${testUser.email} already exists.`);
                    done();
                });
        });

        it('should get 200 deleting a user', (done) => {
            let testUser = {
                email: "user1@test.com",
            };

            chai.request(server)
                .delete("/users")
                .send(testUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('should get 500 deleting a user without email', (done) => {
            chai.request(server)
                .delete("/users")
                .send()
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.error.should.have.property("message");
                    res.body.error.message.should.equal(`No email provided`);
                    done();
                });
        });

        describe('Docs model', () => {
            it('should get 201 adding a document', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestDoc1",
                    content: "Test text 1",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/docs/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("message");
                        res.body.data.message.should.equal("Succesfully created a document.");
                        _id = res.body.data.created_id;
                        done();
                    });
            });
            it('should get 201 adding a document with allowed users', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestDoc2",
                    content: "Test text 2",
                    allowed_users: "user3@test.com"
                };

                chai.request(server)
                    .put("/docs/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("message");
                        res.body.data.message.should.equal("Succesfully created a document.");
                        _id = res.body.data.created_id;
                        done();
                    });
            });
            it('should get 500 adding a document without email', (done) => {
                let testDoc = {
                    name: "TestDoc1",
                    content: "Test text 1",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/docs/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data email provided`);
                        done();
                    });
            });
            it('should get 204 updating a document', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestDoc1",
                    content: "Test text 1 updated",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/docs/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 204 updating a document with allowed users', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestDoc2",
                    content: "Test text 2 updated",
                    allowed_users: "user2@test.com"
                };

                chai.request(server)
                    .put("/docs/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 204 updating an empty document', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestDoc2",
                    content: null,
                    allowed_users: "user2@test.com"
                };

                chai.request(server)
                    .put("/docs/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 500 updating a document without id', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestDoc1",
                    content: "Test text 1",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/docs/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data id provided`);
                        done();
                    });
            });
            it('should get 204 adding allowed user to document', (done) => {
                let testDoc = {
                    _id: _id,
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/docs/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 500 adding allowed user that already exists', (done) => {
                let testDoc = {
                    _id: _id,
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/docs/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`user alredy exists`);
                        done();
                    });
            });
            it('should get 500 adding allowed user without id', (done) => {
                let testDoc = {
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/docs/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data id provided`);
                        done();
                    });
            });
        });

        describe('Codes model', () => {
            it('should get 201 adding a code-document', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestCode1",
                    content: "Test code 1",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/codes/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("message");
                        res.body.data.message.should.equal("Succesfully created a code-document.");
                        _id = res.body.data.created_id;
                        done();
                    });
            });
            it('should get 201 adding a code-document with allowed users', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestCode2",
                    content: "Test code 2",
                    allowed_users: "user3@test.com"
                };

                chai.request(server)
                    .put("/codes/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.an("object");
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("message");
                        res.body.data.message.should.equal("Succesfully created a code-document.");
                        _id = res.body.data.created_id;
                        done();
                    });
            });
            it('should get 500 adding a code-document without email', (done) => {
                let testDoc = {
                    name: "TestCode1",
                    content: "Test code 1",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/codes/add")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data email provided`);
                        done();
                    });
            });
            it('should get 204 updating a code-document', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestCode1",
                    content: "Test code 1 updated",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/codes/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 204 updating a code-document with allowed users', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestCode2",
                    content: "Test code 2 updated",
                    allowed_users: "user2@test.com"
                };

                chai.request(server)
                    .put("/codes/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 204 updating an empty code-document', (done) => {
                let testDoc = {
                    _id: _id,
                    email: "user2@test.com",
                    name: "TestCode2",
                    content: null,
                    allowed_users: "user2@test.com"
                };

                chai.request(server)
                    .put("/codes/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 500 updating a code-document without id', (done) => {
                let testDoc = {
                    email: "user2@test.com",
                    name: "TestCode1",
                    content: "Test code 1 updated",
                    allowed_users: ""
                };

                chai.request(server)
                    .put("/codes/update")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data id provided`);
                        done();
                    });
            });
            it('should get 204 adding allowed user to code-document', (done) => {
                let testDoc = {
                    _id: _id,
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/codes/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
            it('should get 500 adding allowed user that already exists', (done) => {
                let testDoc = {
                    _id: _id,
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/codes/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`user alredy exists`);
                        done();
                    });
            });
            it('should get 500 adding allowed user without id', (done) => {
                let testDoc = {
                    new_user: "user3@test.com",
                };

                chai.request(server)
                    .put("/codes/add/allowed_user")
                    .send(testDoc)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.error.should.have.property("message");
                        res.body.error.message.should.equal(`No data id provided`);
                        done();
                    });
            });
        });
        describe('Auth model', () => {
            it('should get 201 HAPPY PATH', (done) => {
                let user = {
                    email: "user2@test.com",
                    password: "test",
                };

                chai.request(server)
                    .post("/auth/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("type");
                        res.body.data.type.should.equal("success");
                        res.body.data.should.have.property("type");

                        done();
                    });
            });
            it('should get 401 email missing', (done) => {
                let user = {
                    // email: "user2@test.com",
                    password: "test",
                };

                chai.request(server)
                    .post("/auth/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.equal(401);
                        done();
                    });
            });
            it('should get 401 password missing', (done) => {
                let user = {
                    email: "user2@test.com",
                    // password: "test",
                };

                chai.request(server)
                    .post("/auth/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.equal(401);
                        done();
                    });
            });
            it('should get 401 user not found', (done) => {
                let user = {
                    email: "nobody@test.com",
                    password: "test",
                };

                chai.request(server)
                    .post("/auth/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.an("object");
                        res.body.errors.status.should.be.equal(401);
                        done();
                    });
            });
        });
    });
});
