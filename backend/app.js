require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server} = require('socket.io');
const io = new Server(server);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercapp';
mongoose.connect(MONGODB_URI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err=> console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: MONGODB_URI })
}));

//Flash messages middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const apiRoutes = require('./routes/api');

app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/api', apiRoutes);

// Socket.io setup
io.use((socket, next) => {
    next();
});

io.on('connection', (socket) => {
    console.log('Usuario conectado (socket)', socket.id);
    socket.on('chat:message', (msg) => {
        io.emit('chat:message',msg);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
