const path = require("path");
const cors = require('cors');
const router = require('express').Router();
const fs = require("fs");
const jwt = require('jsonwebtoken')
const mysql = require('../configs/mysql');
const multer = require('multer');
const upload = multer({
  storage:multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'uploads/')
    },
    filename:function(req,file,cb){
      console.log(file);
      cb(null,req.body.name + (file.originalname));
    }
  })
});

router.get('/login',(req,res)=>{
  res.send("login")
});
router.post('/login',cors(), async(req,res)=>{
  const {name,token} = req.body;
  // try{
  //   jwt.decode = jwt.verify(token,process.env.jwtSecretCode);
  // }catch(e){
  //   if(e.name === 'TokenExpiredError'){
  //     return res.status(419).send({
  //       name:"",
  //       pid:0,
  //       age:0,
  //       title:"",
  //       team:"",
  //       err:"token expired"
  //     })
  //   }
  //   return res.status(401).send({
  //     name:"",
  //     pid:0,
  //     age:0,
  //     title:"",
  //     team:"",
  //     err:"not available token"
  //   })
  // }
  const isExist = await mysql.query(`SELECT * FROM users.users where name="${name}"`);
  if(isExist[0].length!==0){
    const result = await mysql.query(`SELECT users.*,images.* from users inner join images on users.name = images.name where users.name="${name}"`);
    const image = result[0][0].image;
    const img = fs.readFileSync("uploads/"+image,'base64')
    res.send({...result[0][0],image:img});
  }else{
    console.log(isExist[0].length === 0);
    res.status(400).send({
      name:"",
      pid:0,
      age:0,
      title:"",
      team:"",
      err:"yes"
    })
  }
});

router.get('/signUp',cors(),async(req,res)=>{
  try{
    const teams = await mysql.query("SELECT * FROM users.teams");
    const titles = await mysql.query("SELECT * FROM users.titles");
    res.send({teams:teams[0].map(item=>item.teamName),titles:titles[0].map(item=>item.title)});
  }catch(e){

  }
});
router.post('/signUp',upload.single('image'),async(req,res)=>{
  const {name,age,title,team} = req.body;
  const image = req.body.name + (req.file.originalname)
  const isExist = await mysql.query(`SELECT * FROM users.users where age=${+age} and name="${name}"`)
  if(isExist[0].length===0){
    try{
      await mysql.query(`insert into users.users (name,age,team,title) value("${name}",${+age},"${team}","${title}")`)
      await mysql.query(`insert into users.images (image,name) value("${image}","${name}")`);
      res.send("ok")

    }catch(e){
      console.log(e)
      res.send("err")
    }
  }
});

router.delete('/signUp',(req,res)=>{

});
module.exports = router;