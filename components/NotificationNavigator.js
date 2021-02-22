import React, { Component } from 'react';
import {

    View,
    Text
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Notification from '../screens/Notification';
import ProfileScreen from '../screens/ProfileScreen';
import FollowerScreen from '../screens/FollowerScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen'
import RequestScreen from '../screens/RequestScreen'
import ComplimentsCreen from '../screens/ComplimentsCreen';
import ChatScreen from '../screens/ChatScreen'

const Stack = createStackNavigator();

export default class NotificationNavigator extends Component {
    state = {}
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="Notification" component={Notification} />
                <Stack.Screen options={{ headerShown: false }} name="RequestScreen" component={RequestScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen options={{ headerShown: false }} name="FollowerScreen" component={FollowerScreen} />
                <Stack.Screen options={{ headerShown: false }} name="PostDetailScreen" component={PostDetailScreen} />
                <Stack.Screen options={{ headerShown: false }} name="EditProfileScreen" component={EditProfileScreen} />
                <Stack.Screen options={{ headerShown: false }} name="ComplimentsCreen" component={ComplimentsCreen} />
                <Stack.Screen options={{ headerShown: false }} name="ChatScreen" component={ChatScreen} />

            </Stack.Navigator>
        );
    }
}