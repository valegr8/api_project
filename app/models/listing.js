var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Listing', new Schema({ 
	title: String,
	app_id: String
}));