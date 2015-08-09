"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var OrderSchema = new Schema({
    dc:       {type: Date, default: Date.now},
    name:     {type: String},
    email:    {type: String},
    phone:    {type: String},
    region:   {type: String},
    league:   {type: String},
    leagueId: {type: Schema.ObjectId},
    team:     {type: String},
    message:  {type: String},
    source:   {type: String}
});

OrderSchema.options.toJSON = {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Order', OrderSchema, 'orders');
