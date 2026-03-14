const express = require('express');
const app = express();
const http = require('http').createServer(app);
// 允許傳送最大 50MB 的檔案
const io = require('socket.io')(http, {
  maxHttpBufferSize: 5e7
});
app.use(express.static('public'));

let userCount = 0;
// 準備一組漂亮的顏色給玩家
const colors = ['#FF5733', '#28A745', '#007BFF', '#E83E8C', '#FD7E14', '#6F42C1', '#20C997', '#FFC107'];

io.on('connection', (socket) => {
  // 處理 j3 進入請求
  socket.on('join_chat', () => {
    userCount++;
    socket.userData = {
      id: userCount,
      color: colors[userCount % colors.length]
    };
    // 回傳給該玩家專屬資訊
    socket.emit('chat_joined', socket.userData);
  });

  // 轉發文字訊息
  socket.on('chat message', (msg) => {
    if (socket.userData) {
      io.emit('chat message', {
        id: socket.userData.id,
        color: socket.userData.color,
        text: msg
      });
    }
  });

  // 轉發檔案 (改為點擊下載模式)
  socket.on('file upload', (file) => {
    if (socket.userData) {
      io.emit('file upload', {
        id: socket.userData.id,
        color: socket.userData.color,
        fileName: file.name,
        fileData: file.data
      });
    }
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('伺服器已啟動於連接埠 ' + port);
});
