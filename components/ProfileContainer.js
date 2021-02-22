import React, { useCallback, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Linking,
    Button,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { Avatar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';


const ProfileSection = ({ count, title }) => {
    return (
        <View style={styles.profile__section}>
            <View style={{ marginLeft: 5, alignItems: 'center' }}>
                <Text style={[styles.profile__sectionText, { color: '#303233', fontWeight: 'bold' }]}>{count}</Text>
                <Text style={styles.profile__sectionText}>{title}</Text>
            </View>
        </View>
    );
}

const ProfileContainer = ({ uid, name, icon, totalLikes, myprofile, followers, following, about, compliments, website, requests, propsid, navigation }) => {

    const [loading, setLoading] = useState(false);

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
            console.log(supported)
            if (supported) {
                await Linking.openURL(website);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <Text style={{ color: '#7d86f8' }} onPress={handlePress} >{website}</Text>
    };


    const FollowUnfollow = () => {
        if (myprofile) return null

        else if (following.includes(uid) && followers.includes(uid)) {
            return <View style={{ flexDirection: "row" }} >
                <TouchableOpacity
                    onPress={() => unfollowPress()}
                    style={[styles.profile_button, { backgroundColor: '#FFF', borderColor: '#FF0000', borderWidth: 1 }]} >
                    {loading ? <ActivityIndicator size='small' color='#FF0000' />
                        : <Text style={styles.profile_button_text, { color: '#FF0000' }} >Unollow</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity style={[styles.profile_button, { backgroundColor: '#FFF', borderColor: '#303233', borderWidth: 1, marginLeft: 10 }]} >
                    <Text style={[styles.profile_button_text, { color: '#303233' }]} >Message</Text>
                </TouchableOpacity>
            </View>
        }

        else if (followers.includes(uid)) {
            return <TouchableOpacity
                onPress={() => unfollowPress()}
                style={[styles.profile_button, { backgroundColor: '#FFF', borderColor: '#FF0000', borderWidth: 1 }]} >
                {loading ? <ActivityIndicator size='small' color='#FF0000' />
                    : <Text style={styles.profile_button_text} >Unollow</Text>
                }
            </TouchableOpacity>
        }

        else if (following.includes(uid)) {
            return <TouchableOpacity
                onPress={() => followBackPress()}
                style={[styles.profile_button, { width: '70%', alignItems: 'center' }]} >
                {loading ? <ActivityIndicator size='small' color='#FFF' />
                    : <Text style={styles.profile_button_text} >Follow Back</Text>
                }
            </TouchableOpacity>
        }

        else if (requests.includes(uid)) {
            return <TouchableOpacity 
            style={[styles.profile_button, { width: '70%', alignItems: 'center' }]} 
            onPress={() => requestWithdraw()}
            >
                <Text style={styles.profile_button_text} >requested</Text>
            </TouchableOpacity>
        }

        else {
            return <TouchableOpacity
                onPress={() => followPress()}
                style={[styles.profile_button, { width: '70%', alignItems: 'center' }]} >
                {loading ? <ActivityIndicator size='small' color='#FFF' />
                    : <Text style={styles.profile_button_text} >Follow</Text>
                }
            </TouchableOpacity>
        }
    }

    const followPress = () => {
        setLoading(true)
        firestore().collection('userDetails').doc(propsid).update({
            requests: firestore.FieldValue.arrayUnion(uid)
        }).then(() => {
            Toast.show({
                text1: 'request sent',
                type:'success',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            setLoading(false)
        });
    }

    const requestWithdraw = () => {
        setLoading(true)
        firestore().collection('userDetails').doc(propsid).update({
            requests: firestore.FieldValue.arrayRemove(uid)
        }).then(() => {
            Toast.show({
                text1: 'request withdrawn',
                type:'success',
                visibilityTime: 4000,
                position:'bottom',
                bottomOffset:50
              });
            setLoading(false)
        });
    }

    const followBackPress = () => {
        setLoading(true)
        firestore().collection('userDetails').doc(uid).update({
            following: firestore.FieldValue.arrayUnion(propsid)
        })
            .then(() => firestore().collection('userDetails').doc(propsid).update({
                followers: firestore.FieldValue.arrayUnion(uid)
            }))
            .then(() => setLoading(false));
    }

    const unfollowPress = () => {
        setLoading(true)
        firestore().collection('userDetails').doc(uid).update({
            following: firestore.FieldValue.arrayRemove(propsid)
        })
            .then(() => firestore().collection('userDetails').doc(propsid).update({
                followers: firestore.FieldValue.arrayRemove(uid)
            }))
            .then(() => setLoading(false));
    }

    return (
        <View
            style={styles.profile}
        >
            <View style={styles.profile_top} >
                <Avatar.Image size={80} source={{ uri: icon }} />

                <View style={{ flex: 0.8, alignItems: 'center' }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#303233', marginTop: 5 }}>{name}</Text>
                    <Text style={{ fontSize: 12, color: '#9da5b7' }}>@{name}</Text>

                    <FollowUnfollow />
                </View>
            </View>
            <View style={styles.profile_about}>
                <OpenURLButton url={website}></OpenURLButton>
                <Text style={{ color: '#9da5b7', fontSize: 12, marginTop: 5 }}>
                    {about}
                </Text>
            </View>
            <View style={styles.profile__bottom}>
                <ProfileSection
                    count={totalLikes}
                    title={'Hearts'}
                />
                <TouchableOpacity
                    onPress={() => navigation.push('FollowerScreen', { data: followers, navigation: navigation, title: 'Followers' })}
                >
                    <ProfileSection
                        count={followers.length}
                        title={'Followers'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.push('FollowerScreen', { data: following, navigation: navigation, title: 'Following' })}
                >
                    <ProfileSection
                        count={following.length}
                        title={'Following'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.push('ComplimentsCreen', { data: compliments, navigation: navigation, propsid: propsid, myprofile: myprofile })}
                >
                    <ProfileSection
                        count={compliments.length}
                        title={'Compliments'}
                    />
                </TouchableOpacity>

            </View>

        </View>

    );
}

export default ProfileContainer;

const styles = StyleSheet.create({

    profile: {
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: '#FFF',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,

    },
    profile_top: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around'
    },
    profile_about: {
        padding: 10,
        marginTop: 15,
        width: '100%'
    },
    profile__section: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    profile__sectionText: {
        color: '#9da5b7',
        fontSize: 12,
        fontWeight: '100'
    },
    profile__bottom: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    profile_button: {
        borderRadius: 20,
        backgroundColor: '#7d86f8',
        padding: 5,
        paddingHorizontal: 15,
        marginTop: 10
    },
    profile_button_text: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    compliment: {
        marginTop: 10
    }

})