// end point of fetch all the quiz questions

const express = require('express');
const QuizeModel = require("../model/QuizModel");
const User = require("../model/UserModel");
const router = express.Router();

// Endpoint to fetch all quizzes
router.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await QuizeModel.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to fetch all quiz titles
router.get('/quiz-titles', async (req, res) => {
    try {
        const quizzes = await QuizeModel.find({}, 'title');
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add endpoint to fetch a specific quiz by title
router.get('/quizzes/:title', async (req, res) => {
    const { title } = req.params; // Extract the title from the request parameters

    try {
        // Fetch quiz data from the database where the title matches
        const quiz = await QuizeModel.findOne({ title: title });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for the given title.' });
        }

        res.json(quiz); // Send the quiz data as a response
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Error fetching quiz data.', error: error.message });
    }
});


// Endpoint to save user quiz data
router.post('/save-user', async (req, res) => {
    try {
        const { name, selectedTopic, score } = req.body;
        const user = new User({ name, selectedTopic, score });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
 });


 router.get('/leaderboard', async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/quizzes', async (req, res) => {
    try {
        const newQuizzes = await QuizeModel.insertMany(req.body); 
        res.json(newQuizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
