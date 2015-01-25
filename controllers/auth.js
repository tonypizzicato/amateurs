"use strict";

var passport       = require('passport'),
    passportConfig = require('../config/passport');

module.exports = {
    loginPage: function (req, res) {
        console.log('login page');

        res.render('login', {user: req.user, message: req.session.message});
    },

    login: function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },

    logout: function (req, res) {
        req.logout();
        res.redirect(req.get('Referrer'));
    },

    account: function (req, res) {
        res.render('account', {user: req.user});
    }
};
