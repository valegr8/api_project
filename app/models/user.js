var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Old_User', new Schema({ 
	email: String,
	password: String,
	username: String
}));
