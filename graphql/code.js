const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const CodeType = new GraphQLObjectType({
    name: 'Code',
    description: 'This represents a code-doc',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        allowed_users: {
            type: GraphQLList(GraphQLString),
            resolve: (code) => {
                return code.allowed_users;
            }
        }
    })
});

module.exports = CodeType;
