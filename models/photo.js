var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
    id:         ObjectId,
    dc:         {type: Date, default: Date.now},
    thumb:      {type: Object, required: true},
    main:       {type: Object, required: true},
    type:       {type: String, enum: ['games', 'news']},
    postId:     {type: ObjectId, required: true},
    tournament: {type: ObjectId},
    sort:       {type: Number, default: 9999},
    title:      {type: String},
    local:      {type: String},
    author:     {type: String}
});

/**
 * Get league by name or get all leagues
 *
 * @param {Null|String} name
 *
 * @returns {Promise}
 */
PhotoSchema.statics.getByGame = function (gameId, cb) {
    var promise = this.find({postId: gameId, type: 'games'}).sort({sort: 1});

    return promise.exec(cb);
};

module.exports = mongoose.model('Photo', PhotoSchema, 'photos');

