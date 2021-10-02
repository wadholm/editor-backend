const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const usersModel = require("./models/users.js");

module.exports = function (passport) {
    passport.use(new localStrategy(
        async function(username, password, done) {
            let user;

            try {
                user = await usersModel.findOne(username);
                if (!user) {
                    return done(null, false, {message: 'No user by that email'});
                }
            } catch (e) {
                return done(e);
            }
            let match = await bcrypt.compare(password, user.password);

            if (!match) {
                return done(null, false, {message: 'Not a matching password'});
            }
            return done(null, user);
        }
    ));

    passport.serializeUser((user, done) => {
        console.log("inside serialize: " + user.email);
        done(null, user.email);
    });

    // passport.deserializeUser(async (email, done) => {
    //     try {
    //         let user = await usersModel.findOne(email);

    //         console.log("inside deserialize: " + user);

    //         if (!user) {
    //             return done(new Error('user not found'));
    //         }
    //         done(null, user);
    //     } catch (e) {
    //         done(e);
    //     }
    // });

    passport.deserializeUser(async function(email, done) {
        console.log("start deserialize");
        try {
            let user = await usersModel.findOne(email);

            console.log("inside deserialize: " + user);
            done(null, user);
        } catch (e) {
            done(e);
        }
    });

    // passport.deserializeUser(function(email, done) {
    //     console.log("start deserialize");
    //     usersModel.findOne(email, function(err, user) {
    //         done(err, user);
    //     });
    // });
};
