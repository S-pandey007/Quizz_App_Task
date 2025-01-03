import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import LeaderScreen from './src/screens/LeaderScreen'; // Ensure correct import
import AdminLogin from './src/screens/AdminScreen/AdminLogin';
import AdminPanel from './src/screens/AdminScreen/AdminPanel';
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
                <Stack.Screen name="Quiz" component={QuizScreen} options={{headerShown:false}}/>
                <Stack.Screen name="ResultScreen" component={ResultScreen} options={{headerShown:false}}/>
                <Stack.Screen name="Leader" component={LeaderScreen} options={{headerShown:false}}/>
                <Stack.Screen name="AdminLogin" component={AdminLogin} options={{headerShown:false}}/>
                <Stack.Screen name="AdminPanel" component={AdminPanel} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
