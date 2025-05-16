// server.js
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let messages = [];

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/api/socket_io',
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Send existing messages to new client
    socket.emit('chat-history', messages);

    socket.on('chat-message', (msg) => {
      messages.push(msg);
      io.emit('chat-message', msg); // broadcast to all
    });
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
