const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY, SECRETE_KEY} = require ('../../config');
const User = require('../../models/User');
const {UserInputError} = require ('apollo-server')


module.exports = {
    
    Mutation: {
        /* parent: input from last step/resolver
        args: the RegisterInputs (type) object
        context,
        info: general info about metadata
        */
        async register(_, {registerInput: {username,email, password, confirmPassword}}){
            //TODO: Validate user data
            //TODO: make sure user don't already exist
            const user = await User.findOne({username});
            if (user){
                throw new UserInputError("Username is taken ", {
                    errors: {
                        username: "This username is taken"
                    } // this will be used in front end to be displayed
                })
            }

            // hash password before storing and create a auth token, need to install bcryptjs & jsonwebtoken
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });
            
            const res = await newUser.save();
            
            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username:res.username
            }, SECRETE_KEY, {expiresIn: '1h'} );

            return {
                ...res._doc,
                id: res._id,
                token 
            };
        }

    }
};