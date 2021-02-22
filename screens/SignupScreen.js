import React, { Component } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    Dimensions, Alert,
    ImageBackground,
    ScrollView,
    ActivityIndicator
} from "react-native";
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';


class SignupScreen extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        error: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: false,
        isValidemail: null,
        isValidPassword: true,
        pswd_check: true,
        loading: false,


        contactno: '',
        isValidno: null
    }

    namechange = (val) => {

        this.setState({
            name: val
        })


    }

    checkname = () => {
        if (this.state.name.length < 5) {
            Alert.alert('Wrong Input!', 'Enter valid name', [
                { text: 'Edit' }
            ]);
            return;
        }
    }

    textInputChange = (val) => {
        if (val.length >= 10 && val.endsWith('@gmail.com')) {
            this.setState({
                email: val,
                check_textInputChange: true,
                isValidemail: true
            });
        } else {
            this.setState({
                email: val,
                check_textInputChange: false,
                isValidemail: false
            });
        }
    }
    checkEmail = () => {
        if (!this.state.email.endsWith('@gmail.com')) {
            Alert.alert('Wrong Input!', 'Enter valid email address', [
                { text: 'Edit' }
            ]);
            return;
        }
    }
    contactInputChange = (val) => {

        this.setState({
            contactno: val,
            isValidno: true
        })

    }
    checkContactno = () => {
        if (this.state.contactno.length != 10) {
            Alert.alert('Wrong Input!', 'Enter valid phone no', [
                { text: 'Edit' }
            ]);
            return;
        }
    }
    aboutInputChange = (val) => {
        this.setState({ about: val })
    }
    checkAbout = () => {
        if (this.state.about.length == 0) {
            Alert.alert('Wrong Input!', 'Enter something about yourslef', [
                { text: 'Edit' }
            ]);
            return;
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

    handleConfirmPasswordChange = (val) => {
        if (val === this.state.password) {
            this.setState({ pswd_check: true, confirm_password: val })
        }
        else {
            this.setState({
                confirm_password: val,
                pswd_check: false
            });
        }
    }

    updateSecureTextEntry = () => {
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        });
    }

    updateConfirmSecureTextEntry = () => {
        this.setState({
            confirm_secureTextEntry: !this.state.confirm_secureTextEntry
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

    signUpHandle = () => {

        if (this.state.name.length < 5) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Enter valid name',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }

        if (this.state.email == 0 || this.state.password == 0 || this.state.confirm_password == 0) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Email or password field cannot be empty.',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }
        if (!this.state.email.endsWith('@gmail.com')) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Enter valid email id',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }

        if (this.state.contactno.length != 10) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Enter 10 digit phone no..!',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }

        if (!this.state.pswd_check) {
            Toast.show({
                text1: 'Wrong Input!',
                text2:'Password is not Matching..!',
                type:'error',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            return;
        }

        Alert.alert(
            "Confirmation.!",
            "Press confirm is all above information is correcct.",
            [
                {
                    text: "Edit",
                    style: "cancel"
                },
                { text: "Confirm", onPress: this.signUp }
            ],
            { cancelable: false }
        );

    }

    signUp = () => {
        this.setState({ loading: true })

        auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((result) => firestore().collection('userDetails').doc(auth().currentUser.uid).set({
                name: this.state.name,
                phoneno: this.state.contactno,
                followers: [],
                following: [],
                iconUrl: 'https://firebasestorage.googleapis.com/v0/b/socially-dbce1.appspot.com/o/profile.png?alt=media&token=ff331118-2821-42b6-b525-09148c43b857',
                about: 'I am new to socially...',
                requests: [],
                compliments: [],
                chats: [],
                bgColor: '#FFF',
                website: '',
                email: this.state.email
            }))
            .then(() => this.setState({
                error: '',
                loading: false
            }))
            .then(() => console.log('all done'))
            .catch(err => {
                this.setState({
                    error: err.message,
                    loading: false
                })
            })
    }

    // onLoginSuccess = () => {

    // }


    render() {


        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/backgrounds/contact-purple-top-right.png')}
                    resizeMode='stretch'
                    style={styles.image2}
                    imageStyle={styles.image2_imageStyle}
                >
                    {/*SignUp Text */}
                    <View style={styles.view1}>
                        <Animatable.View
                            animation='fadeInLeft'
                            useNativeDriver={true}
                            duration={1000}
                        >
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <FontAwesome
                                    name="arrow-circle-left"
                                    color='#FFF'
                                    size={30}
                                />
                            </TouchableOpacity>
                        </Animatable.View>
                        <Animatable.View
                            animation='fadeInRight'
                            useNativeDriver={true}
                            duration={1000}
                        >
                            <Text style={styles.login}>Create Account</Text>
                        </Animatable.View>

                    </View>

                    {/*SignUp Form */}


                    <Animatable.View
                        animation='zoomIn'
                        useNativeDriver={true}
                        duration={1000}
                        style={styles.logview}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.text_footer}>Full Name</Text>
                            <View style={[styles.action, { borderBottomColor: '#f2f2f2', borderBottomWidth: 1 }]}>
                                <Image
                                    source={require('../assets/images/profile.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Enter your full name"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.namechange}
                                    value={this.state.name}
                                    onEndEditing={this.checkname}
                                />
                                {this.state.name.length >= 5 ?
                                    <Animatable.View
                                        animation="bounceIn"
                                    >
                                        <Feather
                                            name="check-circle"
                                            color="green"
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : null}
                            </View>
                            <Text style={styles.text_footer}>Email</Text>
                            <View style={[styles.action, { borderBottomColor: '#f2f2f2', borderBottomWidth: 1 }]}>
                                <Image
                                    source={require('../assets/images/message.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Enter your email"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.textInputChange}
                                    value={this.state.email}
                                    onEndEditing={this.checkEmail}
                                />
                                {this.state.isValidemail ?
                                    <Animatable.View
                                        animation="bounceIn"
                                    >
                                        <Feather
                                            name="check-circle"
                                            color="green"
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : null}
                            </View>
                            <Text style={styles.text_footer}>Phone no.</Text>
                            <View style={[styles.action, { borderBottomColor: '#f2f2f2', borderBottomWidth: 1 }]}>
                                <Image
                                    source={require('../assets/images/phone-call.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Enter 10 digit no."
                                    style={styles.textInput}
                                    keyboardType='numeric'
                                    autoCapitalize="none"
                                    onChangeText={this.contactInputChange}
                                    value={this.state.contactno}
                                    onEndEditing={this.checkContactno}
                                />
                                {this.state.contactno.length == 10 ?
                                    <Animatable.View
                                        animation="bounceIn"
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
                                marginTop: 10
                            }]}>Password</Text>
                            <View style={styles.action}>
                                <Image
                                    source={require('../assets/images/password.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Your Password"
                                    secureTextEntry={this.state.secureTextEntry ? true : false}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.handlePasswordChange}
                                    onEndEditing={this.handleValidUser}
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
                            {this.state.isValidPassword ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                                </Animatable.View>
                            }

                            <Text style={[styles.text_footer, {
                                marginTop: 10
                            }]}>Confirm Password</Text>
                            <View style={styles.action}>
                                <Image
                                    source={require('../assets/images/password.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                                <TextInput
                                    placeholder="Confirm Your Password"
                                    secureTextEntry={this.state.confirm_secureTextEntry ? true : false}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={this.handleConfirmPasswordChange}
                                //   onEndEditing={this.checkpswd}
                                />
                                <TouchableOpacity
                                    onPress={this.updateConfirmSecureTextEntry}
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
                            {this.state.pswd_check ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password is not matching...!</Text>
                                </Animatable.View>
                            }

                            {this.state.error === '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.userErr}>{this.state.error}</Text>
                                </Animatable.View>
                            }
                            <View style={{
                                alignItems: 'flex-end',

                                padding: 4
                            }}>
                                <View style={styles.textPrivate}>
                                    <Text style={styles.color_textPrivate}>
                                        By signing up you agree to our
                  </Text>
                                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                                    <Text style={styles.color_textPrivate}>{" "}and</Text>
                                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                                </View>
                                <TouchableOpacity
                                    style={{

                                        width: 100,
                                        padding: 10,
                                        marginTop:15,
                                        paddingHorizontal: 20,
                                        backgroundColor: '#7133D1',
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
                                    onPress={this.signUpHandle}
                                >
                                    {this.state.loading ? <ActivityIndicator
                                        size='small'
                                        color='#F1FAEE'
                                    /> :
                                        <View style={{

                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={styles.textSign}>Sign UP</Text>
                                            <FontAwesome
                                                name="arrow-circle-right"
                                                color='#FFF'
                                                size={20}
                                                style={{ marginLeft: 5 }}
                                            />
                                        </View>
                                    }

                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </Animatable.View>
                    <Animatable.View
                        animation='bounceInUp'
                        useNativeDriver={true}
                        duration={1000}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <Text style={{
                                fontFamily: "roboto-regular",
                                color: "rgba(29,53,87,1)",
                                fontSize: 15
                            }}>
                                Already have an account?
                       </Text>
                            <Text style={{
                                fontFamily: "roboto-700",
                                color: "rgba(113,51,209,1)",
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>Log In</Text>
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

    },
    image2: {
        flex: 1, justifyContent: 'space-evenly'
    },
    image2_imageStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.5,
        resizeMode: 'stretch',

    },
    view1: {
        width: '100%',
        marginTop: '5%',
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    login: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        marginLeft: 20,
        fontSize: 30
    },
    logtxt: {
        fontFamily: "alatsi-regular",
        color: "rgba(241,250,238,1)",
        fontSize: 15
    },
    logview: {
        width: '80%',
        marginLeft: '10%',
        marginTop: 10,
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
        paddingBottom: 0
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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    color_textPrivate: {
        color: 'grey',
        fontSize: 8
    },
    otherbutton: {
        padding: 5,
        paddingHorizontal: 25,
        backgroundColor: '#4885ed',
        borderRadius: 10,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 20,
            width: 20
        },
        elevation: 5,
        shadowOpacity: 0.5,
        shadowRadius: 0,
    }

});

export default SignupScreen;
