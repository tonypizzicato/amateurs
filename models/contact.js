var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
    id:          ObjectId,
    dc:          {type: Date, default: Date.now},
    du:          {type: Date},
    show:        {type: Boolean},
    name:        {type: String},
    title:       {type: String},
    phone:       {type: String},
    email:       {type: String},
    vk:          {
        name: {type: String},
        url:  {type: String}
    },
    image:       {type: String},
    leagueId:    {type: ObjectId},
    tournaments: [{type: ObjectId, ref: 'Tournament'}]
});

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');

