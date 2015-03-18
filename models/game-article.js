"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var GameArticleSchema = new Schema({
    dc:     {type: Date, default: Date.now},
    du:     {type: Date},
    body:   {type: String},
    show:   {type: Boolean},
    type:   {type: String, required: true},
    author: {type: String, default: ''},
    gameId: {type: ObjectId}
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
