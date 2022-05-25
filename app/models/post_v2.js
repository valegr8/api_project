var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Post', new Schema({
	title: String,
	description: String,
	createdBy: String,	//email of the user
	contract: String,
	phone: String,
	rooms: Number, //number of rooms
	//{type:String} is due to mongoose
	//and it means that the type field is a string,
	//otherwise it would mean that available is an array of strings
	available: [{name: String, price: Number, type: {type:String},description: String}],//rooms available
	where: String, //the location of the apartment
}));
