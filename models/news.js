"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NewsSchema = new Schema({
    dc:     {type: Date, default: Date.now},
    du:     {type: Date},
    title:  {type: String},
    body:   {type: String},
    slug:   {type: String, default: ''},
    tags:   {type: Array},
    show:   {type: Boolean},
    stick:  {type: Boolean},
    sort:   {type: Number, default: 1},
    author: {type: String, default: ''}
});

module.exports = mongoose.model('News', NewsSchema, 'news');
