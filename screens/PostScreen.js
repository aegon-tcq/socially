import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Platform,
    TextInput,
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import { TouchableRipple } from 'react-native-paper';

import Toast from 'react-native-toast-message';


import {
    InputField,
    InputWrapper,
    AddImage,
    SubmitBtn,
    SubmitBtnText,
    StatusWrapper,
} from '../styles/AddPost';
import { set } from 'react-native-reanimated';

const PostScreen = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [uid, setUid] = useState('');
    const [description, setDescription] = useState("");

    useEffect(() => {
        setUid(auth().currentUser.uid)
    }, [])

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
        });
    };

    const submitPost = async () => {
        if (image === null) {
            if (description.length === 0) {
                Alert.alert(
                    'Empty!',
                    'Enter something to post..',
                );
            }
            else {
                setUploading(true);
                setTransferred(100)
                try {
                    firestore().collection('posts').add({
                        userId: uid,
                        description: description,
                        comments: [],
                        likes: [],
                        timestamp: firestore.FieldValue.serverTimestamp(),
                        uid: Math.floor((Math.random() * 1000000000))
                    }).then(() => {
                        setUploading(false);
                        Toast.show({
                            text1: 'uploaded',
                            text2:'Refresh post feed to see your post',
                            type:'success',
                            visibilityTime: 4000,
                            position:'bottom',
                            bottomOffset:50
                          });
                        setUploading(false);
                        setDescription("");
                    })

                } catch (e) {
                    console.log(e);
                }
            }
        }
        else {
            const uploadUri = image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

            // Add timestamp to File Name
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;

            setUploading(true);
            setTransferred(0);
            console.log(filename, uploadUri)
            const task = storage().ref('postImages/' + filename).putFile(uploadUri);


            // Set transferred state
            task.on('state_changed', (taskSnapshot) => {
                console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                );

                setTransferred(
                    Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                    100,
                );
            });

            try {
                await task;

                const url = await storage()
                    .ref('postImages/' + filename)
                    .getDownloadURL()
                console.log('URL', url)
                firestore().collection('posts').add({
                    imageUrl: url,
                    userId: uid,
                    description: description,
                    comments: [],
                    likes: [],
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    uid: Math.floor((Math.random() * 1000000000))
                }).then(() => {
                    setUploading(false);
                    Toast.show({
                        text1: 'uploaded',
                        text2:'Refresh post feed to see your post',
                        type:'success',
                        visibilityTime: 4000,
                        position:'bottom',
                        bottomOffset:50
                      });
                    setImage(null);
                    setDescription("");
                })

            } catch (e) {
                console.log(e);
            }
        }


    };

    return (
        <>
            <Header
                LeftIcon={
                    <TouchableRipple
                        onPress={() => { }}
                        rippleColor="rgba(0, 0, 0, .32)"
                        borderless={true}
                    >
                        <MaterialIcons
                            name='keyboard-arrow-left'
                            color='#000'
                            size={30}
                        />
                    </TouchableRipple>
                }
                title={'Share Post'}
                RightIcon={<MaterialIcons
                    name='add-to-photos'
                    color='#000'
                    size={30}
                />}
            />
            <View style={styles.container}>
                <InputWrapper>
                    {image != null ? <AddImage source={{ uri: image }} /> : <AddImage source={require('../assets/images/post.png')} />}

                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder={"what's on your mind"}
                        style={{ fontSize: 20 }}
                        value={description}
                        onChangeText={(val) => setDescription(val)}
                    />
                    {uploading ? (
                        <StatusWrapper>
                            {transferred !== 100 ? <Text>{transferred} %  Processing!</Text>
                                : <Text>uploading!</Text>}
                            <ActivityIndicator size="large" color="#0000ff" />
                        </StatusWrapper>
                    ) : (
                            <SubmitBtn onPress={submitPost}>
                                <SubmitBtnText>upload</SubmitBtnText>
                            </SubmitBtn>
                        )}
                </InputWrapper>
                <ActionButton buttonColor="#2e64e5">
                    <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Take Photo"
                        onPress={takePhotoFromCamera}>
                        <Icon name="camera-outline" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#3498db"
                        title="Choose Photo"
                        onPress={choosePhotoFromLibrary}>
                        <Icon name="md-images-outline" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        </>
    );
};

export default PostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
