const jwt = require('jsonwebtoken');
const tokenSchema = require('./models/token');
require("dotenv").config();

module.exports = class utills{
  static async createToken(data){
    console.log(data)
    const acToken =await jwt.sign({id:data.id,type:"access"},process.env.jwtSecretCode,{algorithm:'HS256',expiresIn:60*60*24});
    const rfToken = await jwt.sign({id:data.id,type:"refresh"},process.env.jwtSecretCode,{algorithm:'HS256',expiresIn:60*60*24});
    console.log(acToken,rfToken);
    const tokens = new tokenSchema({
      id:data.id,
      accessToken:acToken,
      refreshToken:rfToken
    });
    tokens.save().then(res=>{
      console.log(res)
    }).catch(e=>{
      // console.log(e)
    });
    return {acToken,rfToken}
  }
  static checkACToken(token){

  }
}