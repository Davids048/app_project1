const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');
const {SECRET_KEY} = require ('../../config');
const User = require('../../models/User');
const {UserInputError} = require ('apollo-server');
const user = require('../../models/User');

function generateToken(user){
    return  jwt.sign({
        id: user.id,
        email: user.email,
        username:user.username
    }, SECRET_KEY, {expiresIn: '1h'} );
}

module.exports = {
    
    Mutation: {
        /* parent: input from last step/resolver
        args: the RegisterInputs (type) object
        context,
        info: general info about metadata
        */
        async login (_, {username, password}){
            const {errors, valid} = validateLoginInput(username, password);
            if (!valid){
                throw new UserInputError("Errors", {errors});
            }

            const user = await User.findOne({username});
            if (!user){
                errors.general = "User not found";
                throw new UserInputError("User not found", {errors});

            }
            else{
                const match = await bcrypt.compare(password, user.password);
                if (!match){
                    errors.general = "Wrong credentials";
                    throw new UserInputError("Wrong credentials", {errors});
                }
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token 
            };

        },

        async register(_, {registerInput: {username,email, password, confirmPassword}}){
            //TODO: Validate user data
            const {valid, errors } = validateRegisterInput(username,email,password,confirmPassword);
            if (!valid){
                throw new UserInputError("errors", {errors});
            }
            //make sure user don't already exist
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
            
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token 
            };
        }

    }
};