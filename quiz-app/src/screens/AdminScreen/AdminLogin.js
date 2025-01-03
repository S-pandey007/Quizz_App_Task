import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [adminName, setAdminName] = useState('');
    const [password, setPassword] = useState('');

    const predefinedAdminName = 'admin';
    const predefinedPassword = 'admin';

    const handleLogin = () => {
        if (adminName === predefinedAdminName && password === predefinedPassword) {
            navigation.navigate('AdminPanel');
        } else {
            Alert.alert('Invalid Credentials', 'Please enter the correct admin name and password.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Admin Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Admin Name"
                value={adminName}
                onChangeText={setAdminName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default LoginScreen;
