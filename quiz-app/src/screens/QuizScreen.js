import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const QuizScreen = ({ route, navigation }) => {
    const { title } = route.params;
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(15);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(true);

    useEffect(() => {
        fetchQuizData();
    }, []);

    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, isTimerActive]);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("http://192.168.43.3:8000/api/quizzes");
            
            if (!response.data || !response.data.questions || !response.data.questions.length) {
                throw new Error('Invalid quiz data received');
            }
            
            setQuizData(response.data);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setError(error.message || 'Failed to load quiz data');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (timer > 0) {
            setSelectedOption(option);
        }
    };

    const handleNext = () => {
        if (!quizData || !quizData.questions) return;

        const currentQuestion = quizData.questions[currentQuestionIndex];
        
        // Save current question's result
        setResults(prevResults => [...prevResults, {
            question: currentQuestion.question,
            selected: selectedOption,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: selectedOption === currentQuestion.correctAnswer
        }]);

        // Reset for next question
        setSelectedOption(null);
        setTimer(15);
        setIsTimerActive(true);

        // Navigate to next question or results
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            navigation.navigate('ResultScreen', { 
                results: [...results, {
                    question: currentQuestion.question,
                    selected: selectedOption,
                    correctAnswer: currentQuestion.correctAnswer,
                    isCorrect: selectedOption === currentQuestion.correctAnswer
                }]
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Retry" onPress={fetchQuizData} />
            </View>
        );
    }

    if (!quizData || !quizData.questions || !quizData.questions[currentQuestionIndex]) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No quiz questions available</Text>
            </View>
        );
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{quizData.title}</Text>
            <Text style={styles.progress}>
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </Text>
            <Text style={[styles.timer, timer <= 5 && styles.timerWarning]}>
                Time Left: {timer}s
            </Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            
            <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.option,
                            selectedOption === option && styles.selectedOption,
                            timer === 0 && styles.disabledOption
                        ]}
                        onPress={() => handleOptionSelect(option)}
                        disabled={timer === 0}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedOption === option && styles.selectedOptionText
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={currentQuestionIndex === quizData.questions.length - 1 ? 'Submit' : 'Next'}
                    onPress={handleNext}
                    disabled={!selectedOption && timer > 0}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333'
    },
    progress: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 10
    },
    timer: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
        color: '#444'
    },
    timerWarning: {
        color: 'red'
    },
    question: {
        fontSize: 18,
        marginVertical: 15,
        color: '#222',
        lineHeight: 24
    },
    optionsContainer: {
        marginVertical: 10
    },
    option: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    selectedOption: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3'
    },
    disabledOption: {
        opacity: 0.6
    },
    optionText: {
        fontSize: 16,
        color: '#333'
    },
    selectedOptionText: {
        color: '#2196f3'
    },
    buttonContainer: {
        marginTop: 20
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default QuizScreen;