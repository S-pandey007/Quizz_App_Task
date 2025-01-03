import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Button,
    Alert,
    Modal,
    TouchableOpacity,
    Pressable,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
// import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const AdminPanelScreen = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState([]);
    const [newOptions, setNewOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [Quizmodal, setQuizmodal] = useState(false);
    const [questions, setQuestions] = useState([]); 
    const [currentStep, setCurrentStep] = useState('title');
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


    const addNewQuestion = () => {
        setQuestions([...questions, {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
        }]);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'option') {
            const [optionIndex, optionValue] = value;
            updatedQuestions[index].options[optionIndex] = optionValue;
        } else {
            updatedQuestions[index][field] = value;
        }
        setQuestions(updatedQuestions);
    };

    const handleAddQuiz = async () => {
        if (!newQuizTitle || questions.length === 0) {
            Alert.alert('Error', 'Please add a quiz title and at least one question.');
            return;
        }

        // Validate all questions
        for (const question of questions) {
            if (!question.question || !question.correctAnswer || question.options.includes('')) {
                Alert.alert('Error', 'Please fill out all fields for each question.');
                return;
            }
        }

        const formattedQuestions = questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer // This should be the actual answer text, not the index
        }));

        const newQuiz = {
            title: newQuizTitle,
            questions: formattedQuestions,
        };
        console.log('Adding new quiz:', newQuiz);

        try {
            console.log('Submitting quiz:', newQuiz); // For debugging
            const response =  await axios.put('http://192.168.43.3:8000/api/quizzes', newQuiz,{
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response",response.data);
            Alert.alert('Success', 'Quiz added successfully.');
            fetchQuizzes();
            setModalVisible(false);
            resetFields();
        } catch (error) {
            // console.error('Error adding quiz:', error);
            console.error('Error details:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to add quiz.');
        }
    };

    const resetFields = () => {
        setNewQuizTitle('');
        setQuestions([]);
        setCurrentStep('title');
    };

    const renderQuestionForm = (question, index) => (
        <View key={index} style={styles.questionBox}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter question"
                value={question.question}
                onChangeText={(text) => updateQuestion(index, 'question', text)}
            />

            {question.options.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.optionContainer}>
                    <TextInput
                        style={styles.optionInput}
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChangeText={(text) => 
                            updateQuestion(index, 'option', [optionIndex, text])
                        }
                    />
                    <TouchableOpacity
                        style={[
                            styles.radioButton,
                            question.correctAnswer === option && styles.radioButtonSelected,
                        ]}
                        onPress={() => updateQuestion(index, 'correctAnswer', option)}
                    />
                </View>
            ))}
        </View>
    ); 
    



    const renderQuiz = ({ item }) => (
        <View style={styles.quizCard}>
            <Pressable onPress={() => setQuizmodal(true)}>
                <Text style={styles.quizTitle}>{item.title}</Text>
            </Pressable>
            <Modal
                visible={Quizmodal}
                animationType="slide"
                onRequestClose={() => setQuizmodal(false)}
            >
                <View style={styles.modalContainer}>
                    <Pressable onPress={() => setQuizmodal(false)}>
                        <Entypo name="circle-with-cross" size={28} color="black" />
                    </Pressable>
                    <FlatList
                        data={item.questions}
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
                </View>
            </Modal>
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
                keyExtractor={(item) => item._id}
                renderItem={renderQuiz}
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
                    <ScrollView>
                        {currentStep === 'title' ? (
                            <View>
                                <Text style={styles.modalHeader}>Add New Quiz</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Quiz Title"
                                    value={newQuizTitle}
                                    onChangeText={setNewQuizTitle}
                                />
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={() => setCurrentStep('questions')}
                                >
                                    <Text style={styles.buttonText}>Next</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.modalHeader}>{newQuizTitle}</Text>
                                {questions.map((question, index) =>
                                    renderQuestionForm(question, index)
                                )}
                                <TouchableOpacity
                                    style={styles.addQuestionButton}
                                    onPress={addNewQuestion}
                                >
                                    <AntDesign name="pluscircleo" size={24} color="black" />
                                    <Text style={styles.addQuestionText}>Add Question</Text>
                                </TouchableOpacity>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={handleAddQuiz}
                                    >
                                        <Text style={styles.buttonText}>Submit Quiz</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => {
                                            setModalVisible(false);
                                            resetFields();
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </ScrollView>
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
      }
});

export default AdminPanelScreen;
