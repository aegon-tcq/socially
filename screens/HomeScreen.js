import React, { Component } from "react";
import {
    View,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    Image,
    StatusBar
} from "react-native";
import PostCard from '../components/PostCard'
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth'
import Header from '../components/Header'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TouchableRipple } from "react-native-paper";


let onEndReachedCalledDuringMomentum = false;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uid: auth().currentUser.uid,
            isLoading: null,
            moreLoading: null,
            lastDoc: [],
            posts: [],
            myFlollowing: []
        }
    }

    componentDidMount() {
        this.getFollowing();
    }
    

    getFollowing = () => {
        this.setState({ isLoading: true });
        firestore().collection('userDetails').doc(auth().currentUser.uid).get()
            .then((snap) => this.setState({ myFlollowing: snap.data().following }))
            .then(() => this.getposts())
    }

    getposts = async () => {

        this.setState({ isLoading: true });

        const snapshot = await firestore().collection('posts').orderBy('timestamp', 'desc').limit(10).get();

        if (!snapshot.empty) {
            let newPosts = [];

            this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

            for (let i = 0; i < snapshot.docs.length; i++) {
                let userData = {}
                console.log(snapshot.docs[i].data().userId)

                if (this.state.myFlollowing.includes(snapshot.docs[i].data().userId) || snapshot.docs[i].data().userId === auth().currentUser.uid) {
                    firestore().collection('userDetails').doc(snapshot.docs[i].data().userId).get()
                        .then(snap => userData = snap.data())
                        .then(() => {
                            newPosts.push({ ...snapshot.docs[i].data(), ...userData, ...{ postId: snapshot.docs[i].id } });
                        })
                }

            }



            this.setState({ posts: newPosts })
        } else {
            this.setState({ lastDoc: null })
        }
        setTimeout(() => this.setState({ isLoading: false }), 1200)

    }

    getMore = async () => {
        if (this.state.lastDoc) {
            this.setState({ moreLoading: true });

            setTimeout(async () => {
                let snapshot = await firestore().collection('posts').orderBy('timestamp', 'desc').startAfter(this.state.lastDoc.data().uid).limit(10).get();

                if (!snapshot.empty) {
                    let newPosts = this.state.posts;

                    this.setState({ lastDoc: snapshot.docs[snapshot.docs.length - 1] });

                    for (let i = 0; i < snapshot.docs.length; i++) {
                        let userData = {}

                        if (this.state.myFlollowing.includes(snapshot.docs[i].data().userId) || snapshot.docs[i].data().userId === auth().currentUser.uid) {

                            firestore().collection('userDetails').doc(snapshot.docs[i].data().userId).get()
                                .then(snap => userData = snap.data())
                                .then(() => {
                                    newPosts.push({ ...snapshot.docs[i].data(), ...userData, ...{ postId: snapshot.docs[i].id } });
                                })
                        }
                    }

                    this.setState({ posts: newPosts })
                    if (snapshot.docs.length < 10) this.setState({ lastDoc: null });
                } else {
                    this.setState({ lastDoc: null });
                }

                this.setState({ moreLoading: false });
            }, 1000);
        }

        onEndReachedCalledDuringMomentum = true;
    }

    onRefresh = () => {
        setTimeout(() => {
            this.getposts();
        }, 1000);
    }

    renderFooter = () => {
        if (!this.state.moreLoading) return true;

        return (
            <ActivityIndicator
                size='large'
                color={'#D83E64'}
                style={{ marginBottom: 10 }}
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#FFF' }}>
             <StatusBar barStyle='light-content' hidden={false} backgroundColor='#7d86f8' translucent={false} />
                <Header
                    title={'Socially'}
                    LeftIcon={<MaterialIcons
                        name='keyboard-arrow-left'
                        color='#000'
                        size={30}
                    />}
                    RightIcon={
                        <TouchableRipple
                            onPress={() => this.props.navigation.push('MessagesScreen')}
                            rippleColor="rgba(0, 0, 0, .32)"
                            borderless={true}
                        >
                            <Entypo
                                name='chat'
                                color='#000'
                                size={30}
                            />
                        </TouchableRipple>
                    }
                />
                <FlatList
                    vertical
                    showsVerticalScrollIndicator={false}
                    data={this.state.posts}
                    keyExtractor={item => item.timestamp.toString()}
                    renderItem={({ item }) =>
                        <PostCard
                            userName={item.name}
                            userIconUrl={item.iconUrl}
                            postId={item.postId}
                            userId={this.state.uid}
                            postImageUrl={item.imageUrl}
                            postDescription={item.description}
                            postLikes={item.likes}
                            postComments={item.comments}
                        />
                    }
                    ListFooterComponent={this.renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.onRefresh}
                        />
                    }
                    initialNumToRender={2}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum && !this.state.isLoading) {
                            this.getMore();
                        }
                    }
                    }

                    ListEmptyComponent={<View style={{alignItems:'center',justifyContent:'center'}} >
                    <Image  style={{resizeMode:'center',height:windowHeight,width:windowWidth}} source={require('../assets/images/empty.png')}></Image>
                </View>}

                />
            </View>
        );
    }
}