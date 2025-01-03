import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert, TouchableOpacity, FlatList, Pressable } from 'react-native';
import axios from 'axios';
import { Ionicons, Entypo } from '@expo/vector-icons'; // Make sure you have installed @expo/vector-icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const AdminPanel = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [quizModalVisible, setQuizModalVisible] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [newOptions, setNewOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://192.168.43.3:8000/api/quizzes');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion || !correctAnswer || newOptions.includes('')) {
            Alert.alert('Error', 'Please fill out all fields for the question.');
            return;
        }

        const newQuestionObject = {
            question: newQuestion,
            options: newOptions,
            correctAnswer: correctAnswer,
        };

        setQuestions([...questions, newQuestionObject]); // Add the new question to the list
        resetQuestionFields(); // Reset question fields for the next input
    };

    const resetQuestionFields = () => {
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        setCorrectAnswer('');
    };

    const handleAddQuiz = async () => {
        if (!newQuizTitle || questions.length === 0) {
            Alert.alert('Error', 'Please add a quiz title and at least one question.');
            return;
        }

        const newQuiz = {
            title: newQuizTitle,
            questions: questions, // Use the list of questions
        };

        try {
            await axios.post('http://192.168.43.3:8000/api/quizzes', newQuiz);
            Alert.alert('Success', 'Quiz added successfully!');
            fetchQuizzes(); // Refresh the list
            setModalVisible(false); // Close modal
            resetFields();
        } catch (error) {
            console.error('Error adding quiz:', error);
            Alert.alert('Error', 'Failed to add quiz.');
        }
    };

    const resetFields = () => {
        setNewQuizTitle('');
        setQuestions([]);
        resetQuestionFields();
    };

    const renderQuiz = ({ item }) => (
        <View style={styles.quizCard}>
            <Pressable onPress={() => {
                setSelectedQuiz(item);
                setQuizModalVisible(true);
            }}>
                <Text style={styles.quizTitle}>{item.title}</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Panel</Text>
            <View style={styles.Iconcontainer}>
                <Pressable onPress={()=>navigation.navigate("Home")} style={styles.Homeicon}>
                    <Entypo name="home" size={24} color="black" />
                </Pressable>
                <Pressable onPress={()=>navigation.navigate("Leader")} style={styles.Leadericon}>
                    <FontAwesome name="mortar-board" size={24} color="black" />
                </Pressable>
            </View>
            <FlatList
                data={quizzes}
                renderItem={renderQuiz}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Quiz</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalHeader}>Add New Quiz</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Quiz Title"
                        value={newQuizTitle}
                        onChangeText={setNewQuizTitle}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Question"
                        value={newQuestion}
                        onChangeText={setNewQuestion}
                    />

                    {newOptions.map((option, index) => (
                        <TextInput
                            key={index}
                            style={styles.input}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChangeText={text => {
                                const newOptionsCopy = [...newOptions];
                                newOptionsCopy[index] = text;
                                setNewOptions(newOptionsCopy);
                            }}
                        />
                    ))}

                    <TextInput
                        style={styles.input}
                        placeholder="Correct Answer"
                        value={correctAnswer}
                        onChangeText={setCorrectAnswer}
                    />

                    <Button title="Add Question" onPress={handleAddQuestion} />

                    <FlatList
                        data={questions}
                        renderItem={({ item }) => (
                            <View style={styles.questionItem}>
                                <Text style={styles.questionText}>{item.question}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.questionList}
                    />

                    <Button title="Add Quiz" onPress={handleAddQuiz} />
                </View>
            </Modal>

            <Modal
                visible={quizModalVisible}
                animationType="slide"
                onRequestClose={() => setQuizModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setQuizModalVisible(false)}>
                        <Entypo name="circle-with-cross" size={28} color="black" />
                    </TouchableOpacity>
                    {selectedQuiz && (
                        <FlatList
                            data={selectedQuiz.questions}
                            keyExtractor={(q, index) => index.toString()}
                            renderItem={({ item: question }) => (
                                <View style={styles.questionContainer}>
                                    <Text style={styles.questionText}>{question.question}</Text>
                                    {question.options.map((option, index) => (
                                        <Text
                                            key={index}
                                            style={[
                                                styles.optionText,
                                                question.correctAnswer === option && styles.correctAnswer,
                                            ]}
                                        >
                                            {index + 1}. {option}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    list: {
        flex: 1,
    },
    quizCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    questionContainer: {
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    optionText: {
        fontSize: 14,
        color: '#555',
    },
    correctAnswer: {
        color: 'green',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    questionBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    questionNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4285F4',
    },
    radioButtonSelected: {
        backgroundColor: '#4285F4',
    },
    addQuestionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 20,
    },
    addQuestionText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        marginTop: 10,
    },
    nextButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    Iconcontainer: {
        flexDirection: 'row',  // Aligns items horizontally
        justifyContent: 'space-around',  // Distributes icons evenly
        alignItems: 'center',  // Aligns items vertically at the center
        padding: 10,  // Adds padding around the container
        backgroundColor: '#f5f5f5',  // Optional background color
      },
      Homeicon: {
        padding: 10,  // Padding around the icons
      },
      Leadericon: {
        padding: 10,
      },
    questionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    questionList: {
        width: '100%',
        marginTop: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
});

export default AdminPanel;
