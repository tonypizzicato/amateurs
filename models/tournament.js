"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var TournamentSchema = new Schema({
    id:           ObjectId,
    dc:           {type: Date, default: Date.now},
    du:           {type: Date},
    name:         {type: String},
    slug:         {type: String},
    leagueId:     {type: ObjectId}
});

module.exports = mongoose.model('Tournament', TournamentSchema, 'tournaments');
