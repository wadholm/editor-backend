const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql');

const UserType = require("./user.js");
const DocType = require("./doc.js");

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

module.exports = RootQueryType;
