require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const { Server} = require('socket.io');
const { timeStamp } = require('console');
const io = new Server(server);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercapp';
mongoose.connect(MONGODB_URI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err=> console.error('MongoDB connection error:', err));


// Security middleware

app.use(cors({
    origin: ['htto://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(helmet());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({ mongoUrl: MONGODB_URI })
    })
);

//Flash messages middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

//Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date()().toISOString(),
    });
});

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,            // 100 requests por minuto
});

app.use(limiter);


// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const apiRoutes = require('./routes/api');

app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "API de MercApp funcionando correctamente 🚀",
        endpoints: {
            productos: "/api/products",
            categorias: "/api/categories"
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});
// Socket.io setup

io.on('connection', (socket) => {
    console.log('Usuario conectado (socket)', socket.id);
    socket.on('chat:message', (msg) => {
        io.emit('chat:message',msg);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
