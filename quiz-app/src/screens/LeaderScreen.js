import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const LeaderboardScreen = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const response = await axios.get("http://192.168.43.3:8000/api/leaderboard");
            
            if (response.status !== 200) {
              throw new Error('Network response was not ok');
          }
          const data = response.data;
            
            // Map response to only include name and score, and sort in descending order by score
            // const formattedData = response.data
            //     .map((item) => ({
            //         name: item.name,
            //         score: item.score,
            //     }))
            //     .sort((a, b) => b.score - a.score); // Sort highest score first
            data.sort((a, b) => b.score - a.score);
            setLeaderboardData(data);
            // console.log('Fetched leaderboard data:', formattedData);
            console.log(leaderboardData);
            
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.score}</Text>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
          <Text style={styles.title}>LeaderBoard</Text>
            <View style={styles.header}>
                <Text style={styles.headerCell}>Pos.</Text>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>Score</Text>
            </View>
            <FlatList
                data={leaderboardData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
            />
            <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
  },
    header: {
        flexDirection: 'row',
        backgroundColor: '#4285F4',
        padding: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
    },
    rowEven: {
        backgroundColor: '#f9f9f9',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    list: {
        marginTop: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
