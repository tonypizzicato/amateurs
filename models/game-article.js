"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var GameArticleSchema = new Schema({
    dc:          {type: Date, default: Date.now},
    du:          {type: Date},
    body:        {type: String},
    show:        {type: Boolean},
    type:        {type: String, required: true},
    author:      {type: String, default: ''},
    centralGame: {type: Boolean, default: false},
    gameId:      {type: ObjectId},
    tournament:  {type: ObjectId},
    imageHome:   {type: String},
    imageAway:   {type: String},
    video:       [Schema.Types.Mixed]
});

GameArticleSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('GameArticle', GameArticleSchema, 'game_articles');
