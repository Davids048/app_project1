const {model, Schema} = require('mongoose');

//can be handled by graphql
const userSchema = new Schema({ 
    username: String,
    password: String,
    email: String,
    createdAt: String

});

module.exports = model('User', userSchema);
