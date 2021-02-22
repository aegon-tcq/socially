import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

const TextInputField = ({ title, placeholder, imageUrl, onChangeText, check_textInputChange }) => {
    const colors = { text: '#05375a' }
    return (
        <View>
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>{title}</Text>
            <View style={styles.action}>
                <Image
                    source={require('../assets/images/profile.png')}
                    style={{ height: 20, width: 20 }}
                />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={onChangeText}
                />
                {check_textInputChange ?
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image2: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    image2_imageStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.5,
        resizeMode: 'stretch',

    },
    view1: {
        width: '100%',
        marginTop: '15%',
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
        height: '50%',
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

export default TextInputField 