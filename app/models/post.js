var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Post_old', new Schema({
	title: String,
	description: String,
	createdBy: String,	//email of the user
}));
