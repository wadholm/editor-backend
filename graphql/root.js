const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql');

const UserType = require("./user.js");
const DocType = require("./doc.js");
const CodeType = require("./code.js");

const users = require("../models/users");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        user: {
            type: UserType,
            description: 'A single user',
            args: {
                email: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let userArray = await users.getAll();

                return userArray.find(user => user.email === args.email);
            }
        },
        users: {
            type: GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function() {
                return await users.getAll();
            }
        },
        doc: {
            type: DocType,
            description: 'A single document',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let docs = await getDocs();

                return docs.find(doc => doc._id === args._id);
            }
        },
        docs: {
            type: GraphQLList(DocType),
            description: 'List of docs',
            resolve: async function() {
                return await getDocs();
            }
        },
        code: {
            type: CodeType,
            description: 'A single code-doc',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let codes = await getCodes();

                return codes.find(code => code._id === args._id);
            }
        },
        codes: {
            type: GraphQLList(CodeType),
            description: 'List of codes',
            resolve: async function() {
                return await getCodes();
            }
        }
    })
});

async function getDocs() {
    let userArray = await users.readAll();
    let docs = [];
    let ids = [];

    userArray.forEach(function(user) {
        user["docs"].forEach(function(doc) {
            if (ids.indexOf(doc._id) === -1) {
                docs.push(doc);
                ids.push(doc._id);
            }
        });
    });

    return docs;
}

async function getCodes() {
    let userArray = await users.readAll();
    let codes = [];
    let ids = [];

    userArray.forEach(function(user) {
        user["codes"].forEach(function(code) {
            if (ids.indexOf(code._id) === -1) {
                codes.push(code);
                ids.push(code._id);
            }
        });
    });

    return codes;
}

module.exports = RootQueryType;
