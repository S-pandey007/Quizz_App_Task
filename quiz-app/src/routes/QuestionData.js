// if (currentQuestionIndex < quizData.questions.length - 1) {
//     setCurrentQuestionIndex(prev => prev + 1);
// } else {
//     const currentResult = {
//         question: currentQuestion.question,
//         selected: selectedOption,
//         correctAnswer: currentQuestion.correctAnswer,
//         isCorrect: selectedOption === currentQuestion.correctAnswer,
//     };

//     const totalScore = [...results, currentResult].reduce(
//         (score, result) => score + (result.isCorrect ? 1 : 0),
//         0
//     );

//     // Data to be sent to the backend
//     const userData = {
//         name: 'John Doe', // Replace with dynamic user data if available
//         selectedTopic: quizData.title,
//         score: totalScore,
//     };

//     // POST the user result data to the backend
//     fetch('http://localhost:8000/api/save-result', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to save user result');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('User result saved successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error saving user result:', error.message);
//         });

//     // Navigate to the result screen
//     navigation.navigate('ResultScreen', { 
//         results: [...results, currentResult],
//         totalScore,
//     });
// }
