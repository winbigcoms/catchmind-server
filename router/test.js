const router = require('express').Router();
const mysql = require('../configs/mysql');
const subTitle = require('../models/subTitle');

router.get('/testMysql',async(req,res)=>{
  try{
    const teams = await mysql.query("SELECT * FROM users.teams");
    res.send(teams[0]);
  }catch(e){
    console.log(e)
  }
});

router.get('/testMongo',(req,res)=>{
  const subTitles = new subTitle({
    subTitles:["원피스","나루토","블리치"]
  });
  subTitles.save().then((e)=>{
    console.log(e);
    res.send(e.subTitles)
  }
  ).catch(e=>{
    console.log(e)
  });
})

module.exports = router;