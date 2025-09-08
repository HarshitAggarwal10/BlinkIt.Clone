require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const { Server } = require('socket.io');
const { MONGO_URI, SESSION_SECRET, PORT, FRONTEND_ORIGIN } = require('./config');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminProductRoutes = require('./routes/adminProducts');
const adminCouponRoutes = require('./routes/adminCoupons');
const orderRoutes = require('./routes/orders');
const riderRoutes = require('./routes/rider');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: FRONTEND_ORIGIN, credentials: true },
});
app.set('io', io);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { httpOnly: true, secure: false }, // secure:true in production
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rider', riderRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('rider:join', (riderId) => {
    socket.join('rider_' + riderId);
  });

  socket.on('order:join', (orderId) => {
    socket.join('order_' + orderId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
