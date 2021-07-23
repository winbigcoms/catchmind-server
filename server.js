const express = require('express')
const cors = require('cors');
const app = express();
const path = require('path')
const login = require('./router/login');
const test = require('./router/test');
const mongoose = require('./configs/mongo');
const utills = require('./utills');
const server = require('http').createServer(app);

require("dotenv").config();
app.use(cors());
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded())
app.get('/', function (req, res) {
  res.send(true);
});
io = require('socket.io')(server,{
  cors:{
    origin:"http://localhost:3000"
  },
  maxHttpBufferSize:1e8
});
let userArray = [];
let subTitles = [];
let subTitle = "";



io.on('connection',socket=>{
  if(subTitles.length===0){
    mongoose.connection.db.collection("subtitles",(err,collection)=>{
      collection.find({}).sort({_id:-1}).limit(1).toArray()
        .then(res=>{
          console.log(res[0].subTitles,2);
          subTitles = res[0].subTitles
          subTitle = res[0].subTitles[Math.floor(Math.random()*3)]
        })
        .catch(err=>console.log(err));
    });
  }
  console.log("logined");
  socket.on('users',(data)=>{
    socket.nickName = data.pid;
    userArray.push(data);
    // io.to(socket.id).emit('recivedUsers',userArray);
    io.sockets.emit('recivedUsers',userArray);
  });
  
  socket.on("getSubtitle",()=>{
    io.to(socket.id).emit('subtitle',subTitle);
  })
  socket.on("changeSubject",()=>{
    if(subTitles.length === 0){
      mongoose.connection.db.collection("subtitles",(err,collection)=>{
        collection.find({}).sort({_id:-1}).limit(1).toArray()
          .then(res=>{
            subTitles = res[0].subTitles;
            subTitle = res[0].subTitles[Math.floor(Math.random()*3)]
            socket.emit('subject',subTitle);
          })
          .catch(err=>console.log(err));
      })
    }else{
      subTitle = subTitles[Math.floor(Math.random()*3)]
      socket.emit('subject',subTitle);
    }
  })
  socket.on('disconnect',()=>{
    userArray = userArray.filter(data=>data.pid !== socket.nickName);
    socket.broadcast.emit('recivedUsers',userArray);
    console.log('유저 나감')
  });
  socket.on('chatting',(msg)=>{
    app.io.emit('chatting',msg);
  })
  socket.on('drawing',(path)=>{
    app.io.emit('drwing',path)
  });
  socket.on('removePath',(path)=>{
    app.io.emit('removePath',path)
  });
})


app.use(login);
app.use(test);

server.listen(8000)