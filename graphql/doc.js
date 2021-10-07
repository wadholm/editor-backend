const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        allowed_users: {
            type: GraphQLList(GraphQLString),
            resolve: (doc) => {
                return doc.allowed_users;
            }
        }
    })
});

module.exports = DocType;
