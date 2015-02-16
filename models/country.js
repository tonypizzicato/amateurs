"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var keymirror = require('keymirror');

var State = keymirror({
    CREATED:  null,
    ACTIVE:   null,
    ARCHIVED: null
});

var CountrySchema = new Schema({
    dc:       {type: Date, default: Date.now},
    du:       {type: Date},
    name:     {type: String, required: true},
    slug:     {type: String, required: true, default: ''},
    state:    {type: String, required: true, default: State.CREATED},
    sort:     {type: Number, default: 1},
    leagueId: {type: ObjectId}
});

CountrySchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('Country', CountrySchema, 'countries');
