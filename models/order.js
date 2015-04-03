"use strict";

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var OrderSchema = new Schema({
    dc:     {type: Date, default: Date.now},
    name:   {type: String},
    email:  {type: String},
    region: {type: String},
    league: {type: String},
    team:   {type: String},
    source: {type: String}
});

OrderSchema.options.toJSON = {
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.dc;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Order', OrderSchema, 'orders');
