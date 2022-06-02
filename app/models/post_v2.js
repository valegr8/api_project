var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Post', new Schema({
	title: String,
	description: String,
	createdBy: String,	// owner of the post
	contract: String,	// annual / monthly ...
	phone: String,		// phone number of the owner
	showPrice: String,  // the price shown (can be different from the one of the rooms)
	rooms: Number,      // number of rooms
	email: String,      // email of the user
	available: [{name: String, price: Number,description: String}],  // rooms available
	where: String,      // the location of the apartment
}));
