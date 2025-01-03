const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const allQuizzRoutes = require('../src/routes/Allquizz'); // Import the route
 // Import the route
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api', allQuizzRoutes); // Use the quiz route
 // Use the question data route

app.get('/', (req, res) => {
    res.send('Server is running');
});

// MongoDB URI
const MONGODB_URI = "mongodb+srv://user:user@quizapp.hmm0f.mongodb.net/?retryWrites=true&w=majority";

// Check if the MongoDB URI is provided
if (!MONGODB_URI) {
    console.error('Error: MongoDB connection URI is missing.');
    process.exit(1); // Exit the process if no URI is provided
    
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connected'))
    .catch((err) => console.error('Database connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// app.post('/search/:title', async (req, res) => {
//     const { title } = req.param; // Extract the title from the request body
//     try {
//         const quiz = await QuizeModel.findOne({ title });
//         if (quiz) {
//             res.status(200).json(quiz);
//         } else {
//             res.status(404).json({ message: 'Quiz not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });