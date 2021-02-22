import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen'

const Stack = createStackNavigator();


export default class ExploreNavigator extends Component {
    state = {}
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />

                <Stack.Screen options={{ headerShown: false }} name="MessagesScreen" component={MessagesScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ChatScreen" component={ChatScreen} />
            </Stack.Navigator>

        );
    }
}