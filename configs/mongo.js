const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/catchmind",{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then((e)=>{
  console.log('on mongo');
}).catch(e=>console.log(e));


module.exports = mongoose