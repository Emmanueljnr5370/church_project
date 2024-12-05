const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const payment = require("./routes/payment.routes");
dotenv.config();
const cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Example route for the root URL
app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Route for image upload
app.post('/upload', upload.single('image'), (req, res) => {
    console.log('Image received:', req.file.originalname);
    let filename = req.file.originalname;
    // Handle image processing or storage logic here
    res.status(200).json({ message: 'Image uploaded', path: `https://monegliseci.com/uploads/${filename}` });
});

// Import routes
const userRoutes = require('./routes/user.routes');
const churchRoutes = require('./routes/church.routes');
const notificationRoutes = require('./routes/notification.routes');
const paymentRoutes = require('./routes/payment.routes');
const roleRoutes = require('./routes/role.routes');

// Use routes
app.use('/api/accounts', userRoutes);
app.use('/api/church', churchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transaction', paymentRoutes);
app.use('/api/role', roleRoutes);
app.use("/api/pay", payment);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});