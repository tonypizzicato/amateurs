var mongodb   = require('mongodb'),
    UserModel = require('../models/user');

var userData = {
    username: 'Father',
    email:    'tony.grebnev@gmail.com',
    password: 'change',
    roles:    ['god', 'admin']
};

exports.up = function (db, next) {
    var user = new UserModel(userData);
    console.log(user);
    user.save(function (err, user) {
        if (err) {
            console.log('Could not save new user. Details: ' + err);
        }

        console.dir(user);
        next();
    });

    next();
};

exports.down = function (db, next) {
    UserModel.findOneAndRemove({username: userData.username}).exec();

    next();
};
