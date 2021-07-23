const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  id:{type:String,required:true},
  accessToken:{ type: String, required: true, unique: true },
  refreshToken:{ type: String, required: true, unique: true }
});
module.exports = mongoose.model('tokens',tokenSchema);