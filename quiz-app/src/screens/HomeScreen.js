import { View, Text, StyleSheet, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [userName, setUserName] = useState('');
    const [title, setTitle] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const navigation = useNavigation()
    useEffect(() => {
        // Fetch quiz titles from the server
        axios.get('http://192.168.43.3:8000/api/quiz-titles') // Use the correct IP address for Android emulator
        .then((response) => {
            const titles = response.data.map(quiz => quiz.title);
            console.log(titles);
            setTitle(titles);
        }).catch((error) => {
            console.error('Error fetching quiz titles:', error);
        });
    }, []);

    const handleStartQuiz = async () => {
        // Store user name and selected title in an object
        const userData = {
            userName: userName,
            selectedTitle: selectedTitle
        };
        console.log(userData);
        navigation.navigate('Quiz', { title: selectedTitle });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.titleItem, selectedTitle === item && styles.selectedTitleItem]}
            onPress={() => setSelectedTitle(item)}
        >
            <Text style={styles.titleText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Welcome header text */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome to the New Quiz</Text>
            </View>

            {/* Rules */}
            <View style={styles.rulesContainer}>
                <Text style={styles.rulesHeader}>Rules</Text>
                <View style={styles.rulesTextContainer}>
                    <Text style={styles.rulesText}>
                        1. Question Type: Multiple Choice Questions (MCQs)
                        {'\n'}2. Users must enter their full name before starting
                        {'\n'}3. Marking Scheme: 1 mark per correct answer
                        {'\n'}4. Time Limit: 15 seconds per question
                        {'\n'}5. Users can choose from available quiz topics
                        {'\n'}6. Immediate score display after quiz
                        {'\n'}7. Leaderboard ranking
                    </Text>
                </View>
            </View>

                       {/* Take user name */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Your Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Enter your full name'
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

             {/* Quiz titles */}
             <View style={styles.titleContainer}>
                <Text style={styles.inputLabel}>Select Quiz Title</Text>
                <FlatList
                    data={title}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={styles.titleList}
                />
            </View>



            <Pressable style={styles.startButton} onPress={handleStartQuiz}>
                <Text style={styles.startButtonText}>Start Quiz</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
        top:15,
        backgroundColor:'#007bff',borderRadius:7,
    },
    headerText: {
        fontSize: 24,
        padding:7,
        
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white', // Match the button color
    },
    rulesContainer: {
        marginBottom: 20,
    },
    rulesHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        
    },
    rulesTextContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 2,
    },
    rulesText: {
        fontSize: 16,
        lineHeight: 24,
    },
    titleContainer: {
        marginBottom: 20,
    },
    titleList: {
        paddingVertical: 10,
    },
    titleItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        elevation: 2,
    },
    selectedTitleItem: {
        backgroundColor: '#007bff',
    },
    titleText: {
        fontSize: 16,
        color: '#000',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 18,
        marginBottom: 5,
    },
    textInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 2,
    },
    startButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});