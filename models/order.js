"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var OrderSchema = new Schema({
    dc:           {type: Date, default: Date.now},
    name:         {type: String},
    email:        {type: String},
    phone:        {type: String},
    teamOrPlayer: {type: String},
    region:       {type: String},
    league:       {type: String},
    leagueId:     {type: Schema.ObjectId},
    format:       {type: Number},
    team:         {type: String},
    position:     {type: String},
    age:          {type: String},
    message:      {type: String},
    experience:   {type: String},
    source:       {type: String}
});

OrderSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Order', OrderSchema, 'orders');
