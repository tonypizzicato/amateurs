"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var TournamentSchema = new Schema({
    id:       {type: String}, // change to ObjectId,
    dc:       {type: Date, default: Date.now},
    du:       {type: Date},
    name:     {type: String},
    slug:     {type: String},
    state:    {type: String, default: 'CREATED'},
    leagueId: {type: String}, // change to ObjectId
    remoteId: {type: String}, // change to ObjectId
    country:  {type: ObjectId, ref: 'Country'},
    settings: {type: Object, default: {}}
});

TournamentSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('Tournament', TournamentSchema, 'tournaments');
