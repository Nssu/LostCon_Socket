var express = require("express");
var app = express();
const http = require('http');
const path = require("path");
const fs = require('fs');

//const hostname = '0.0.0.0';
const hostname = '192.168.0.200';
const port_api = 3000;

const port_socket = 3001;

app.use(express.static(path.join(__dirname, 'public')));


// PORT 번호 요청시 리턴해주기
app.get('/allocatePort', (req, res) => {
  //res.send('Hello World TEST!')
  var obj = new Object();
  obj.portNum = port_socket;
  obj.item_key = req.query.item_key;

  console.log(JSON.parse(JSON.stringify(obj)));
  res.send(JSON.stringify(obj));
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + "/index.html")
  // fs.readFile('views/index.html', (error, data) => {
  //   res.writeHead(200, {'Conent-Type' : 'text/html'});
  //   res.end(data);
  // })
});

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

const server = http.createServer(app);
const server_socket = http.createServer();


// 버전상의 문제가 발생
//let io = require('socket.io')(server_socket);
var io = require('socket.io')(server_socket, {'transports': ['websocket', 'polling']});


var numUsers = 0;
// https://www.zerocho.com/category/NodeJS/post/57edfcf481d46f0015d3f0cd
// 서버에서 받을 이벤트명과 그에 대한 메서드 작성

// io.on
// io.on('connection', (socket) => {
//   // connect 이벤트를 받았다면
//   var addUser = false;
//     //client.on('event', function(data){});
//     //client.on('disconnect', function(){});
//     socket.on('new message', (data) => {
//       socket.broadcast.emit('new message', {
//         username : socket.username,
//         message: data
//       })
//     })
// });

// io.sockets.on 차이점
io.sockets.on('connection', (socket) => {
  //onsole.log("connection completea");
  socket.emit('toclient', { msg: 'Welcome' }); 
  console.log("input twice");
  
  socket.on('fromclient', (data) => {
    socket.broadcast.emit('toclient', data); // 입력한 메세지를 broadcast, 타 사용자에게 메세지를 보내는 역할
    socket.emit('toclient', data); // 입력한 메세지를 자신에게 보냄
    console.log('Message from client : ' + data.msg);
  });
});



// listerners
server_socket.listen(port_socket, hostname, () => {
  console.log(`Socket Server running at http://${hostname}:${port_socket}/`);
})



server.listen(port_api, hostname, () => {
  console.log(`Server running at http://${hostname}:${port_api}/`);
});






// var io = require('socket.io')();
// io.on('connection', function(client){});
// io.listen(3000);
