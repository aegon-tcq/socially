/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen'
import SplashScreen from './screens/SplashScreen'

import BottomNavigator from './components/BottomNavigator'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';

import LottieView from 'lottie-react-native'

import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

class App extends Component {

  state = {
    LoggedIn: null
  }


  componentDidMount() {
    setTimeout(() => auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          LoggedIn: true
        })
      }
      else {
        this.setState({
          LoggedIn: false
        })
      }

    }), 2200)
  }
  render() {
    switch (this.state.LoggedIn) {
      case false:
        return (
          <>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
                <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen} />
                <Stack.Screen options={{ headerShown: false }} name="SignupScreen" component={SignupScreen} />
              </Stack.Navigator>
            </NavigationContainer>
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </>
        );
      case true:
        return(
          <> 
          <BottomNavigator /> 
          <Toast ref={(ref) => Toast.setRef(ref)} /> 
          </>
        )

      default:
        return <View style={{flex:1,backgroundColor:'#FFF',alignItems:"center",justifyContent:'flex-end'}} >
          <LottieView
        ref={animation => {
          this.animation = animation;
        }}
        autoPlay 
        loop
        source={require('./assets/socially.json')}
      />
      <Text style={{marginBottom:100,color:'#7d86f8',fontSize:18,fontWeight:'bold'}} >Socially</Text>
        </View>

    }
  }
};



export default App;
