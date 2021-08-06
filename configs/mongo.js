const { MongoClient } = require('mongodb');

require("dotenv").config();

const uri = `mongodb+srv://catchminder:${process.env.mongo_pw}@catchmind.umcuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = client