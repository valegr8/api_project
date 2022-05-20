var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Post', new Schema({
	title: String,
	description: String,
	createdBy: String,	//email of the user
	post_id: Number 	//id of the post, used by the api because shorter then the one assigned by mongoDB (_id)
}));
