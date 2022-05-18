var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Post', new Schema({
	// _id: mongoose.ObjectId,
	title: String,
	description: String,
	createdBy: String,
	app_id: Number
}));
