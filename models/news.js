"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NewsSchema = new Schema({
    dc:       {type: Date, default: Date.now},
    du:       {type: Date},
    title:    {type: String},
    body:     {type: String},
    slug:     {type: String, default: ''},
    teaser:   {type: String, default: ''},
    tags:     {type: Array},
    show:     {type: Boolean},
    stick:    {type: Boolean},
    sort:     {type: Number, default: 1},
    author:   {type: String, default: ''},
    leagueId: {type: ObjectId},
    country:  {type: ObjectId, ref: 'Country'},
    image:    {type: String}
});

NewsSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('News', NewsSchema, 'news');
