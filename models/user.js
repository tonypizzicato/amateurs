"use strict";

var mongoose    = require('mongoose'),
    bcrypt      = require('bcrypt'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId,
    SALT_FACTOR = 10;

// User schema
var userSchema = new Schema({
    id: ObjectId,
    dc: {type: Date, default: Date.now},
    du: {type: Date},

    username:  {type: String, required: true, unique: true},
    email:     {type: String, required: true, unique: true},
    password:  {type: String, required: true},
    phone:     {type: String},
    vk:        {type: String},
    avatar:    {type: String},
    leagueId:  {type: ObjectId},
    positions: {type: Array, default: []},
    roles:     {type: Array, required: true, default: ['user']}
});

// Bcrypt middleware
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Export user model
module.exports = mongoose.model('User', userSchema, 'users');
