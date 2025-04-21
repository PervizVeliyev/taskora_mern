require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connect = require('./configs/db');
const http = require('http');
const socketIo = require('socket.io');
const { Message, Conversation } = require('./models');
const PORT = 8080;

const {
  userRoute,
  conversationRoute,
  gigRoute,
  messageRoute,
  orderRoute,
  reviewRoute,
  authRoute
} = require('./routes');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    'https://taskora-mern.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🔌 User connected');

  socket.on('joinRoom', (conversationID) => {
    socket.join(conversationID);
    console.log(`🟢 Joined room: ${conversationID}`);
  });

  socket.on('sendMessage', async (message) => {
    try {
      const { conversationID, description, userID } = message;

      const newMessage = new Message({ conversationID, userID, description });
      await newMessage.save();

      await Conversation.findOneAndUpdate(
        { conversationID },
        { $set: { lastMessage: description } }
      );

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('userID', 'username image');

      io.to(conversationID).emit('receiveMessage', populatedMessage);
    } catch (err) {
      console.error('❌ Error handling message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❎ User disconnected');
  });
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/orders', orderRoute);
app.use('/api/messages', messageRoute);
app.use('/api/reviews', reviewRoute);

// Test Routes
app.get('/', (req, res) => {
  res.send('Hello, Topper!');
});

app.get('/ip', (req, res) => {
  const list = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ips = list.split(',');
  res.send({ ip: ips[0] });
});

// Start server
server.listen(PORT, async () => {
  try {
    await connect();
    console.log(`🚀 Listening at http://localhost:${PORT}`);
  } catch ({ message }) {
    console.log('❌ DB Error:', message);
  }
});