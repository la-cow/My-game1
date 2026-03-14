const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('file upload', (data) => {
    io.emit('file upload', data);
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('伺服器順利啟動囉！');
});

