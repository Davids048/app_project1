const {gql} = require('apollo-server');

module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    
    # // these files must be returned, but the user might opt to not fill them in.
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    # // making a change in database
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!):Post!
        deletePost(postId:ID!):String!
    }
`;
