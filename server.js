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
let artist = "";


io.on('connection',socket=>{
  if(subTitles.length===0){
    mongoose.connection.db.collection("subtitles",(err,collection)=>{
      collection.find({}).sort({_id:-1}).limit(1).toArray()
        .then(res=>{
          subTitles = res[0].subTitles
          subTitle = res[0].subTitles[Math.floor(Math.random()*3)]
        })
        .catch(err=>console.log(err));
    });
  };
  console.log("logined");
  socket.on('users',(data)=>{
    socket.nickName = data.pid;
    userArray.push(data);
    if(!artist){
      artist = userArray[Math.floor(Math.random()*(userArray.length))].pid;
    }
    io.sockets.emit('recivedUsers',userArray);
    console.log(data.pid,artist);
    io.to(socket.id).emit('artist',data.pid===artist?true:false);
  });
  socket.on('chatting',(data)=>{
    const who = userArray.find(data=>data.pid===socket.nickName);
    if(data.value===subTitle){
      console.log(who.name)
      io.sockets.emit('goldenCorrect',who.name);  
    }
    io.sockets.emit('chatting',data);
  });
  
  socket.on("getSubject",()=>{
    io.to(socket.id).emit('subject',subTitle);
  });

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
    if(socket.nickName === artist){
      artist = userArray.length!==0?userArray[Math.floor(Math.random()*(userArray.length))].pid:"";
    };
    const newArtist = userArray.length!==0?userArray.filter(data=>data.pid===artist)[0].name:"";
    socket.emit("artistClose",newArtist);
    console.log('유저 나감')
  });

  socket.on('drowStart',(path)=>{
    socket.broadcast.emit('drowStart',path);
  });
  socket.on('drawing',(path)=>{
    socket.broadcast.emit('drawing',path);
  });
  socket.on('resetPaint',()=>{
    socket.broadcast.emit('resetPaint');
  });
  socket.on('pencilState',(state)=>{
    console.log(state);
    socket.broadcast.emit('pencilState',state);
  });
  socket.on('color',(hex)=>{
    console.log(hex);
    socket.broadcast.emit('color',hex);
  });
  socket.on('pencilStroke',(state)=>{
    socket.broadcast.emit('pencilState',state);
  });
  socket.on('eraserStroke',(state)=>{
    socket.broadcast.emit('eraserStroke',state);
  });
  socket.on('stopPaint',(state)=>{
    socket.broadcast.emit('stopPaint');
  });
})


app.use(login);
app.use(test);

server.listen(8000)