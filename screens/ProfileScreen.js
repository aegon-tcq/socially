import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from "react-native";
import ProfileContainer from '../components/ProfileContainer'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { FAB, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Header from '../components/Header';
import UserPostImageGrid from '../components/UserPostImageGrid'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

import RBSheet from "react-native-raw-bottom-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";


export default class ProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uid: '',
            name: '',
            iconUrl: '',
            phoneno: '',
            email: '',
            website: '',
            compliments: [],
            totalLikes: 0,
            requests: [],
            posts: [],
            followers: [],
            following: [],
            myPosts: [],
            phone: '',
            about: '',
            loading: true
        }
    }

    componentDidMount() {
        console.log(this.props.route.params.uid)
        if (this.props.route.params.uid === undefined) {
            console.log('inside if')
            this.getUid()
        }
        else {
            console.log('got uid', this.props.route.params.uid)
            this.setState({ uid: this.props.route.params.uid },
                () => this.getUserData())
        }
    }

    getUid = async () => {
        let myid = await auth().currentUser.uid
        this.setState({ uid: myid }, () => this.getUserData())
    }

    getUserData = () => {
        console.log('inside userdata', this.state.uid)
        firestore().collection('userDetails').doc(this.state.uid)
            .onSnapshot((snap) => {
                this.setState({
                    name: snap.data().name,
                    iconUrl: snap.data().iconUrl,
                    phoneno: snap.data().phoneno,
                    email: snap.data().email,
                    website: snap.data().website,
                    followers: snap.data().followers,
                    following: snap.data().following,
                    about: snap.data().about,
                    requests: snap.data().requests,
                    compliments: snap.data().compliments,
                })
                console.log(snap.data())
                this.getMyPosts()
            })

    }

    getMyPosts = () => {
        console.log('uid=>>>>>>>>>', this.state.uid)
        firestore().collection('posts').where('userId', '==', this.state.uid).get()
            .then((posts) => {

                let p = []
                let likes = 0
                posts.docs.map((post) => {
                    p.push({ ...post.data(), ...{ postId: post.id } })
                    likes += post.data().likes.length
                })
                this.setState({ myPosts: p, totalLikes: likes, loading: false }, () => console.log(this.state.myPosts))
            })
    }

    signout = () => {

        auth().signOut()
    }

    render() {
        switch (this.state.loading) {
            case false:
                return (
                    <View style={styles.profileScreen} >

                        <Header
                            title={'My Profile'}
                            LeftIcon={
                                <TouchableRipple
                                    onPress={() => this.props.navigation.goBack()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <MaterialCommunityIcons
                                        name='arrow-left'
                                        color='#303233'
                                        size={30}
                                    />
                                </TouchableRipple>
                            }
                            RightIcon={
                                <TouchableRipple
                                    onPress={() => this.RBSheet.open()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <Entypo
                                        name='dots-two-vertical'
                                        color='#9da5b7'
                                        size={30}
                                    />
                                </TouchableRipple>
                            }
                        />
                        <ScrollView>
                            <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
                                <ProfileContainer
                                    icon={this.state.iconUrl}
                                    uid={auth().currentUser.uid}
                                    name={this.state.name}
                                    navigation={this.props.navigation}
                                    followers={this.state.followers}
                                    following={this.state.following}
                                    posts={this.state.myPosts}
                                    totalLikes={this.state.totalLikes}
                                    website={this.state.website}
                                    propsid={this.props.route.params.uid}
                                    about={this.state.about}
                                    myprofile={this.state.uid === auth().currentUser.uid}
                                    requests={this.state.requests}
                                    compliments={this.state.compliments}
                                />
                            </View>
                            <UserPostImageGrid
                                userName={this.state.name}
                                userIconUrl={this.state.iconUrl}
                                myPosts={this.state.myPosts}
                                navigation={this.props.navigation}
                            />
                        </ScrollView>
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
                                onPress={() => this.signout()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                                    <AntDesign
                                        name='logout'
                                        color='#ff0000'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >logout</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={() => this.RBSheet.close()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                                style={styles.bottomButtons}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} >
                                    <Entypo
                                        name='cross'
                                        color='#303233'
                                        size={30}
                                    />
                                    <Text style={{ marginLeft: 15, color: '#23395D' }} >Close</Text>
                                </View>
                            </TouchableRipple>
                        </RBSheet>
                        { this.props.route.params.uid === undefined || this.props.route.params.uid === auth().currentUser.uid ?
                            <FAB
                                style={styles.fab}
                                icon="pencil"
                                onPress={() => this.props.navigation.push('EditProfileScreen', {
                                    uid: this.state.uid,
                                    name: this.state.name,
                                    iconUrl: this.state.iconUrl,
                                    phoneno: this.state.phoneno,
                                    email: this.state.email,
                                    about: this.state.about,
                                    website: this.state.website

                                })}
                            /> :
                            null}
                    </View>
                );
            default:
                return <View style={styles.loading} >
                    <ActivityIndicator size='large' color='#303233' />
                </View>
        }
    }
}

const styles = StyleSheet.create({
    profileScreen: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#FFF'

    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#23395D'
    },
})