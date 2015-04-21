var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var FieldSchema = new Schema({
    id:          ObjectId,
    dc:          {type: Date, default: Date.now},
    du:          {type: Date},
    show:        {type: Boolean},
    sort:        {type: Number, default: 999},
    title:       {type: String},
    address:     {type: String},
    geo:         {type: [Number], index: '2d'},
    image:       {type: String},
    remoteId:    {type: ObjectId},
    leagueId:    {type: ObjectId},
    tournaments: [{type: ObjectId, ref: 'Tournament'}]
});

FieldSchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('Field', FieldSchema, 'fields');

