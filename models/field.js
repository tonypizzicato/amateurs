var transliteration = require('transliteration'),
    mongoose        = require('mongoose'),
    Schema          = mongoose.Schema,
    ObjectId        = Schema.ObjectId;

var FieldSchema = new Schema({
    id:          ObjectId,
    dc:          {type: Date, default: Date.now},
    du:          {type: Date},
    show:        {type: Boolean, default: false},
    sort:        {type: Number, default: 999},
    title:       {type: String},
    slug:        {type: String},
    howto:       {type: String},
    address:     {type: String},
    metro:       {
        name:  {type: String},
        color: {type: String}
    },
    geo:         {type: [Number], index: '2d'},
    image:       {type: Object},
    remoteId:    {type: ObjectId},
    leagueId:    {type: ObjectId},
    tournaments: [{type: ObjectId, ref: 'Tournament'}]
});

FieldSchema.pre('save', true, function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    this.slug = transliteration.slugify(this.title);
    next();
});

module.exports = mongoose.model('Field', FieldSchema, 'fields');

