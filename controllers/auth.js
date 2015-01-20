"use strict";


module.exports = {
    login: function (req, res, next) {
        console.log('logged in');

        next();
    },

    logout: function (req, res, next) {
        console.log('logged out');

        next();
    }
};
