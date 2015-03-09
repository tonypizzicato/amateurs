var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
    id:       ObjectId,
    dc:       {type: Date, default: Date.now},
    thumb:    {type: String, required: true},
    main:     {type: String, required: true},
    optional: {type: String},
    type:     {type: String, enum: ['game', 'news']},
    postId:   {type: ObjectId, required: true}
});

module.exports = mongoose.model('Photo', PhotoSchema, 'photos');


/**
 * Get league by name or get all leagues
 *
 * @param {Null|String} name
 *
 * @returns {Promise}
 */
PhotoSchema.statics.getByGame = function (gameId, cb) {
    var promise = this.find({postId: gameId, type: 'game'});

    return promise.exec(cb);
};

