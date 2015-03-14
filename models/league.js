"use strict";

var _ = require('underscore');

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var LeagueSchema = new Schema({
    id:        ObjectId,
    dc:        {type: Date, default: Date.now},
    du:        {type: Date},
    name:      {type: String},
    slug:      {type: String},
    sort:      {type: Number},
    remoteId:  {type: ObjectId},
    countries: [{type: ObjectId, ref: 'Country'}]
});

LeagueSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

/**
 * @returns {Array} Array of countries with leagues
 */
LeagueSchema.statics.getByCountries = function (res, next) {
    return this.find({show: true}).populate({}).exec(function (err, docs) {
        if (err) {
            return next(err);
        }

        res = {};
        docs.forEach(function (item) {
            res[item]
        });
    });
};

var model = mongoose.model('League', LeagueSchema, 'leagues');

module.exports = model;
