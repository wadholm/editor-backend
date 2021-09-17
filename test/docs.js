/* global it describe before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

const database = require("../db/database.js");
const collectionName = "docs";
let _id = "";

chai.use(chaiHttp);

describe('Docs', () => {
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

    describe('GET /docs', () => {
        it('200 HAPPY PATH for docs', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);

                    done();
                });
        });
    });

    it('should get 201 adding document', (done) => {
        let testDoc = {
            name: "TestDoc",
            content: "Test text"
        };

        chai.request(server)
            .post("/docs")
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
    it('should get 500 for missing id', (done) => {
        let testDoc = {
            name: "TestDoc",
            content: "Test update"
        };

        chai.request(server)
            .put("/docs")
            .send(testDoc)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it('should get 204 updating document', (done) => {
        let testDoc = {
            _id: _id,
            name: "TestDoc",
            content: "Test update"
        };

        chai.request(server)
            .put("/docs")
            .send(testDoc)
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
    });

    it('should get 200 getting one document by id', (done) => {
        let testDoc = {
            _id: _id,
        };

        chai.request(server)
            .get(`/docs/${testDoc._id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("data");
                res.body.data.should.be.an("array");
                res.body.data.length.should.be.above(0);

                done();
            });
    });

    it('should get 500 for incorrect id', (done) => {
        let testDoc = {
            _id: 0,
        };

        chai.request(server)
            .get(`/docs/${testDoc._id}`)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
});
