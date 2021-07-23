const mongoose = require('mongoose');
const autoinc = require('mongoose-auto-increment');
autoinc.initialize(mongoose);

const subTitleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  subTitles: [String],
},{
  timestamps:true,
});

subTitleSchema.plugin(autoinc.plugin,{
  model:'SubTitle',
  field:'id',
  startAt:1,
  increment:1
})
module.exports = mongoose.model('SubTitle',subTitleSchema);