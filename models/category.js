var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CategorySchema = new Schema({
    id:   ObjectId,
    dc:   {type: Date, default: Date.now},
    du:   {type: Date},
    sort: {type: Number, default: 999},
    name: {type: String},
    news: [{type: ObjectId, ref: 'News'}]
});

CategorySchema.pre('save', function (next) {
    var now = new Date();
    this.du = now;
    if (!this.dc) {
        this.dc = now;
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');

