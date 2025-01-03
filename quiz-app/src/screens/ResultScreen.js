import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
    const { name,title ,results,totalScore } = route.params;
    console.log(name);
    console.log(title);
    console.log(totalScore);
    
    
    
    // Calculate total marks
    const totalMarks = results.reduce((score, result) => (result.isCorrect ? score + 1 : score), 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz Results</Text>
            <Text style={styles.title}>User Name : {name}</Text>
            <Text style={styles.score}>Quiz Title : {title}</Text>
            <Text style={styles.score}>Your Score: {totalMarks} / {results.length}</Text>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {results.map((result, index) => (
                    <View key={index} style={styles.resultContainer}>
                        <Text style={styles.question}>
                            Q{index + 1}: {result.question}
                        </Text>
                        <Text style={styles.answer}>
                            Your Answer: {result.selected}{' '}
                            {result.isCorrect ? (
                                <Text style={styles.correct}>(Correct)</Text>
                            ) : (
                                <Text style={styles.incorrect}>(Incorrect)</Text>
                            )}
                        </Text>
                        {!result.isCorrect && (
                            <Text style={styles.correctAnswer}>
                                Correct Answer: {result.correctAnswer}
                            </Text>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button title="LeaderBoard" onPress={() => navigation.navigate('Leader')} />
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#4caf50',
    },
    scrollView: {
        paddingBottom: 20,
    },
    resultContainer: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    answer: {
        fontSize: 15,
        color: '#333',
    },
    correct: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    incorrect: {
        color: '#f44336',
        fontWeight: 'bold',
    },
    correctAnswer: {
        fontSize: 15,
        color: '#2196f3',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
    
});

export default ResultScreen;
