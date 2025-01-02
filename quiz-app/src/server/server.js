const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const allQuizzRoutes = require('../routes/Allquizz'); // Import the route
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', allQuizzRoutes); // Use the route

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Direct MongoDB URI
const MONGODB_URI = 'mongodb+srv://user:user@quizapp.hmm0f.mongodb.net/?retryWrites=true&w=majority';

// Check if the MongoDB URI is provided
if (!MONGODB_URI) {
    console.error('Error: MongoDB connection URI is missing.');
    process.exit(1); // Exit the process if no URI is provided
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('Database Connected'))
.catch((err) => {
    console.error('Database Connection Error:', err);
    process.exit(1); // Exit process if database connection fails
});

// Start the server
const PORT = 8000; // Default port, or set any other
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});