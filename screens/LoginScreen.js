import React, { Component } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    ImageBackground,
    ScrollView,
    StatusBar,
    Image,
    ActivityIndicator
} from "react-native";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';

class LoginScreen extends Component {

    state = {
        email: '',
        password: '',
        error: '',
        loading: false,
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: false,
        isValidPassword: true,
    }
    textInputChange = (val) => {
        if (val.length >= 10) {
            this.setState({
                email: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            this.setState({
                email: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    handlePasswordChange = (val) => {
        if (val.length >= 6) {
            this.setState({
                password: val,
                isValidPassword: true
            });
        } else {
            this.setState({
                password: val,
                isValidPassword: false
            });
        }
    }

    updateSecureTextEntry = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

    handleValidUser = (val) => {
        if (val.length >= 4) {
            this.setState({
                isValidUser: true
            });
        } else {
            this.setState({
                isValidUser: false
            });
        }
    }
    loginHandle = () => {

        if (this.state.email == 0 || this.state.password == 0) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Username or password field cannot be empty.',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }

        this.setState({ loading: true })

        auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.onLoginSuccess)
            .catch(err => {
                this.setState({
                    error: err.message,
                    loading: false
                })
            })


    }
    onLoginSuccess = () => {
        this.setState({
            error: '',
            loading: false
        })
    }

    onForgotPress = () => {
        if (this.state.email == 0) {
            Toast.show({
                text1: 'Enter email',
                text2:'Please Enter the email Address',
                type:'info',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });

            return;
        }

        this.setState({ loading: true })

        auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                this.setState({ loading: false })
                Toast.show({
                    text1: 'Email Sent!',
                    text2:'Check your inbox.',
                    type:'success',
                    visibilityTime: 4000,
                    position:'bottom',
                    bottomOffset:50
                  });
                return;
            })
            .catch((err) => {
                const msg = err.message
                Toast.show({
                    text1: 'Wrong Input!',
                    text2:msg,
                    type:'error',
                    visibilityTime: 4000,
                    position:'bottom',
                    bottomOffset:50
                  });
                return;
            })
    }



    render() {

        const colors = { text: '#05375a' }

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' hidden={false} backgroundColor='#9d5cff' translucent={true} />
                <ImageBackground
                    source={require('../assets/backgrounds/contact-purple-top-right.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                >
                    {/*Login Text */}

                    <Animatable.View
                        animation='fadeInRight'
                        duration={1000}
                        useNativeDriver={true}
                        style={{marginTop:10}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                marginLeft: 15,
                            }}
                        >
                            <FontAwesome
                                name="arrow-circle-left"
                                color='#FFF'
                                size={30}
                            />
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View
                        animation='fadeInLeft'
                        duration={1000}
                        useNativeDriver={true}
                    >
                        <View style={styles.view1}>
                            <Text style={styles.login}>Login</Text>
                            <Text style={styles.logtxt}>Please login In to continue.</Text>
                        </View>
                    </Animatable.View>

                    {/*Login Form */}

                    <Animatable.View
                        animation='zoomIn'
                        duration={1000}
                        style={styles.logview}
                        useNativeDriver={true}
                    >

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={[styles.text_footer, {
                                color: colors.text
                            }]}>Email or Phone no.</Text>
                            <View style={styles.action}>
                                <Image
                                    source={require('../assets/images/profile.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Your Email"
                                    placeholderTextColor="#666666"
                                    style={[styles.textInput, {
                                        color: colors.text
                                    }]}
                                    autoCapitalize="none"
                                    onChangeText={this.textInputChange}
                                    onEndEditing={this.handleValidUser}
                                />
                                {this.state.check_textInputChange ?
                                    <Animatable.View
                                        animation="bounceIn"
                                        useNativeDriver={true}
                                    >
                                        <Feather
                                            name="check-circle"
                                            color="green"
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : null}
                            </View>
                            <Text style={[styles.text_footer, {
                                color: colors.text,
                                marginTop: 5
                            }]}>Password</Text>
                            <View style={styles.action}>
                                <Image
                                    source={require('../assets/images/password.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Your Password"
                                    placeholderTextColor="#666666"
                                    secureTextEntry={this.state.secureTextEntry ? true : false}
                                    style={[styles.textInput, {
                                        color: colors.text
                                    }]}
                                    autoCapitalize="none"
                                    onChangeText={this.handlePasswordChange}

                                />
                                <TouchableOpacity
                                    onPress={this.updateSecureTextEntry}
                                >
                                    {this.state.secureTextEntry ?
                                        <Feather
                                            name="eye-off"
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <Feather
                                            name="eye"
                                            color="grey"
                                            size={20}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={this.onForgotPress}>
                                <Text style={{ color: '#05375a', marginTop: 10 }}>Forgot password?</Text>
                            </TouchableOpacity>
                            {this.state.error == '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={{ color: '#EA3456' }}>Username or Password is Incorrect.</Text>
                                </Animatable.View>
                            }
                            <View style={{
                                alignItems: 'flex-end',
                                padding: 10
                            }}>
                                <TouchableOpacity
                                    style={{
                                        width: 100,
                                        padding: 10,
                                        paddingHorizontal: 20,
                                        backgroundColor: '#7133D1',
                                        marginTop: 15,
                                        borderRadius: 20,
                                        shadowColor: "rgba(0,0,0,1)",
                                        shadowOffset: {
                                            height: 5,
                                            width: 5
                                        },
                                        elevation: 5,
                                        shadowOpacity: 0.15,
                                        shadowRadius: 0,
                                    }}
                                    onPress={this.loginHandle}
                                >
                                    {this.state.loading ? <ActivityIndicator
                                        size='small'
                                        color='#F1FAEE'
                                    /> :
                                        <View style={{

                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                            <Text style={styles.textSign}>LogIn</Text>
                                            <FontAwesome
                                                name="arrow-circle-right"
                                                color='#FFF'
                                                size={20}
                                            />
                                        </View>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animatable.View>
                    <Animatable.View
                        animation='fadeInDown'
                        duration={1100}
                        useNativeDriver={true}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SignupScreen')}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 40
                            }}
                        >
                            <Text style={{
                                color: "rgba(29,53,87,1)",
                                fontSize: 15
                            }}>
                                Dont have account?
                       </Text>
                            <Text style={{
                                color: "rgba(113,51,209,1)",
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Sign UP</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </ImageBackground>

            </View>

        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'space-evenly'
    },
    image2: {
        flex: 1,
        justifyContent:'space-around',
    },
    image2_imageStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.5,
        resizeMode: 'stretch',

    },
    view1: {
        width: '100%',
        marginTop: '10%',
        marginLeft: 20,
    },
    login: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        fontSize: 40
    },
    logtxt: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        fontSize: 15
    },
    logview: {
        width: '80%',
        marginLeft: '10%',
        marginTop: 40,
        backgroundColor: "#FFF",
        // opacity: 0.3,
        borderRadius: 20,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 20,
            width: 20
        },
        elevation: 5,
        shadowOpacity: 0.5,
        shadowRadius: 0,
        padding: 20,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    textSign: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
    }

});

export default LoginScreen;