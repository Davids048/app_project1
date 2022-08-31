const {ApolloServer} = require ('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphgql/typeDefs');
const resolvers = require('./graphgql/resolvers');
const {MONGODB} = require('./config.js'); 
// putting in brackets deconstructs the returned stuff


const server = new ApolloServer({
    typeDefs,
    resolvers
});


mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('mongodb connected la la la');
        return server.listen({port:8000});
    })
    .then((res) =>{
        console.log(`Server running at ${res.url}`);
    });

