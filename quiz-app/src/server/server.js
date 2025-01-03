const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const allQuizzRoutes = require('../routes/Allquizz'); // Import the route
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', allQuizzRoutes); // Use the route

app.get('/', (req, res) => {
    res.send('Server is running');
});

// MongoDB URI
const MONGODB_URI = 'mongodb+srv://user:user@quizapp.hmm0f.mongodb.net/?retryWrites=true&w=majority';

// Check if the MongoDB URI is provided
if (!MONGODB_URI) {
    console.error('Error: MongoDB connection URI is missing.');
    process.exit(1); // Exit the process if no URI is provided
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database Connected'))
.catch((err) => {
    console.error('Database Connection Error:', err);
    process.exit(1); // Exit process if database connection fails
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});