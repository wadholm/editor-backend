const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocType = require("./doc.js");
const CodeType = require("./code.js");

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        docs: { type: GraphQLList(DocType),
            resolve: (user) => {
                return user.docs;
            }
        },
        codes: { type: GraphQLList(CodeType),
            resolve: (user) => {
                return user.codes;
            }
        }
    })
});

module.exports = UserType;
