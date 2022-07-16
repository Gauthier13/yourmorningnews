var mongoose = require('mongoose');
const uid2 = require('uid2');

var userSchema = mongoose.Schema({
    firstname:String,
    email:String,
    password:String,
    token: String,
    articles : [{
        img : String,
        title : String,
        content : String,
        desc : String
    }]
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel; //export du model de user