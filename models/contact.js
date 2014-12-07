var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
    id:      ObjectId,
    dc:      {type: Date, default: Date.now},
    du:      {type: Date},
    title:   {type: String},
    name:    {type: String},
    phone:   {type: String},
    email:   {type: String},
    vk:      {
        name: {type: String},
        url:  {type: String}
    },
    photo:   {type: String},
    country: {type: String},
    league:  {type: String}
});

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');

