var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
    id:          ObjectId,
    dc:          {type: Date, default: Date.now},
    du:          {type: Date},
    show:        {type: Boolean},
    sort:        {type: Number, default: 999},
    name:        {type: String},
    title:       {type: String},
    phone:       {type: String},
    toCall:      {type: Boolean},
    email:       {type: String},
    vk:          {
        name: {type: String},
        url:  {type: String}
    },
    image:       {type: String},
    leagueId:    {type: ObjectId},
    tournaments: [{type: ObjectId, ref: 'Tournament'}]
});

ContactSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');

