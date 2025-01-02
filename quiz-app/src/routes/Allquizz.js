// end point of fetch all the quiz questions

const express = require('express');
const QuizeModel = require("../model/QuizModel");

const router = express.Router();

router.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await QuizeModel.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
