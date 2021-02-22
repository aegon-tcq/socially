import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import Header from '../components/Header'
import { Avatar, TouchableRipple } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Toast from 'react-native-toast-message';

export default class EditProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uid: this.props.route.params.uid,
            name: this.props.route.params.name,
            phoneno: this.props.route.params.phoneno,
            email: this.props.route.params.email,
            about: this.props.route.params.about,
            loading: false,
            image: this.props.route.params.iconUrl,
            website:  this.props.route.params.website,
            iconremoved: false
        }
    }

    takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
            cropperCircleOverlay: true
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            this.setState({ image: imageUri })
            this.RBSheet.close()
        });
    };

    choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: true
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            this.setState({ image: imageUri })
            this.RBSheet.close()
        });
    };

    removeImage = () => {
        this.setState({
            image:'https://firebasestorage.googleapis.com/v0/b/socially-dbce1.appspot.com/o/profile.png?alt=media&token=ff331118-2821-42b6-b525-09148c43b857',
            iconremoved: true
        })
        this.RBSheet.close()
    }


    updateProfile = async () => {
        if (this.state.name.length < 5) {
            Alert.alert('Wrong Input!', 'Name length atleast be 5', [
                { text: 'Edit' }
            ]);
            return;
        }
        if (this.state.phoneno.length !== 10) {
            Alert.alert('Wrong Input!', 'Enter 10 digit phone no.', [
                { text: 'Edit' }
            ]);
            return;
        }
        this.setState({ loading: true })
        if (this.state.image !== this.props.route.params.iconUrl && !this.state.iconremoved) {
            const uploadUri = this.state.image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

            // Add timestamp to File Name
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
            await storage().ref('postImages/' + filename).putFile(uploadUri);
            const url = await storage()
                .ref('postImages/' + filename)
                .getDownloadURL()

            firestore().collection('userDetails').doc(this.state.uid).update({
                name: this.state.name,
                phoneno: this.state.phoneno,
                about: this.state.about,
                website: this.state.website,
                iconUrl: url
            }).then(this.onUpdate)
        }
        else if (this.state.iconremoved) {
            firestore().collection('userDetails').doc(this.state.uid).update({
                name: this.state.name,
                phoneno: this.state.phoneno,
                about: this.state.about,
                website: this.state.website,
                iconUrl: this.state.image
            }).then(this.onUpdate)
        }
        else {
            firestore().collection('userDetails').doc(this.state.uid).update({
                name: this.state.name,
                phoneno: this.state.phoneno,
                about: this.state.about,
                website: this.state.website,
            }).then(this.onUpdate)
        }
    }

    onUpdate = () => {

        Toast.show({
            text1: 'Profile updated',
            visibilityTime: 4000,
            position:'bottom',
            bottomOffset:50
          });
        this.setState({ loading: false })
        this.props.navigation.goBack()
        return;
    }

    render() {
        return (
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <Header
                    LeftIcon={
                        <TouchableRipple
                            onPress={() => this.props.navigation.goBack()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <MaterialIcons
                                name='keyboard-arrow-left'
                                color='#032468'
                                size={30}
                            />
                        </TouchableRipple>
                    }
                    title={'Edit Profile'}
                    RightIcon={
                        <FontAwesome
                            name="user-circle"
                            size={30}
                            color={"#032468"}
                        />
                    }
                />
                <ScrollView>
                    <View style={styles.editProfile} >

                        <Avatar.Image size={100} source={{ uri: this.state.image }} />
                        <TouchableRipple
                            onPress={() => this.RBSheet.open()}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <View style={styles.editProfile_icon} >
                                <FontAwesome5
                                    name="user-edit"
                                    size={15}
                                    color={"#032468"}
                                />
                                <Text style={styles.editProfile_icon_text} >Change Profile Photo</Text>
                            </View>
                        </TouchableRipple>
                        <RBSheet
                            ref={ref => {
                                this.RBSheet = ref;
                            }}
                            height={150}
                            openDuration={250}
                            customStyles={{
                                container: {
                                    justifyContent: 'space-evenly',

                                }
                            }}
                        >
                            <TouchableRipple
                                onPress={this.takePhotoFromCamera}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfile_bottom_option} >
                                    <FontAwesome
                                        name="camera"
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfile_bottom_option_text}  >Take from camera</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={this.choosePhotoFromLibrary}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfile_bottom_option} >
                                    <MaterialIcons
                                        name='perm-media'
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfile_bottom_option_text} >Choose from Gallery</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={this.removeImage}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <View style={styles.editProfile_bottom_option} >
                                    <MaterialIcons
                                        name='delete'
                                        size={20}
                                        color={"#032468"}
                                    />
                                    <Text style={styles.editProfile_bottom_option_text} >Remove Profile Photo</Text>
                                </View>
                            </TouchableRipple>
                        </RBSheet>
                        <View style={styles.editProfile_form} >

                            <Text style={styles.editProfile_form_text} >Full Name</Text>
                            <TextInput
                                placeholder='name'
                                value={this.state.name}
                                onChangeText={(val) => this.setState({ name: val })}
                                style={styles.input}
                            />
                            <Text style={styles.editProfile_form_text} >Email</Text>
                            <TextInput
                                placeholder='Enter email id'
                                editable={false}
                                value={this.state.email}
                                style={styles.input}
                            />
                            <Text style={styles.editProfile_form_text} >Phone no.</Text>
                            <TextInput
                                placeholder='Enter 10 digit phone no.'
                                keyboardType='numeric'
                                value={this.state.phoneno}
                                onChangeText={(val) => this.setState({ phoneno: val })}
                                style={styles.input}
                            />
                            <Text style={styles.editProfile_form_text} >website</Text>
                            <TextInput
                                placeholder='Enter website link with https'
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.website}
                                onChangeText={(val) => this.setState({ website: val })}
                                style={styles.input}
                            />
                            <Text style={styles.editProfile_form_text} >About me</Text>
                            <TextInput
                                placeholder='Something about yourself'
                                multiline={true}
                                numberOfLines={4}
                                value={this.state.about}
                                onChangeText={(val) => this.setState({ about: val })}
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={this.updateProfile}

                        >
                            <View style={styles.editProfile_update} >
                                {this.state.loading ?
                                    <ActivityIndicator size='small' color='#032468' />
                                    :
                                    <>
                                        <FontAwesome5
                                            name='save'
                                            size={20}
                                            color={"#032468"}
                                        />

                                        <Text style={[styles.editProfile_bottom_option_text, { fontWeight: 'bold' }]} >Update</Text>
                                    </>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    editProfile: {
        flex: 1,
        alignItems: 'center',
        padding: 20

    },
    editProfile_bottom_option: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 25
    },
    editProfile_bottom_option_text: {
        marginLeft: 15
    },
    editProfile_icon: {
        flexDirection: 'row',
        marginTop: 10
    },
    editProfile_icon_text: {
        marginLeft: 10,
        color: '#032468',
    },
    editProfile_form: {
        width: '100%',
        marginTop: 15
    },
    editProfile_form_text: {
        color: '#032468',
        marginTop: 10,
        fontWeight: 'bold'
    },
    input: {
        borderBottomWidth: 0.5,
        borderColor: '#9da5b7',

    },
    editProfile_update: {
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#7d86f8',
        padding: 10,
        paddingHorizontal: 15,
        marginTop: 20
    }
})