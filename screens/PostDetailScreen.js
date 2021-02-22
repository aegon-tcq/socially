import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { FAB, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import PostCard from '../components/PostCard';
import auth from '@react-native-firebase/auth'
export default class PostDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: this.props.route.params.userName,
            iconUrl: this.props.route.params.userIconUrl,
            postItem: this.props.route.params.postData,
            uid: auth().currentUser.uid
        }
    }

    componentDidMount() {
        console.log('Post Data =>>>>>>>>>>>>>', this.state.postItem)
    }

    render() {
        return (
            <>
                <Header
                    title={'Post'}
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
                    RightIcon={<Entypo
                        name='dots-two-vertical'
                        color='#303233'
                        size={30}
                    />}
                />
                <PostCard
                    userName={this.state.name}
                    userIconUrl={this.state.iconUrl}
                    postId={this.state.postItem.postId}
                    userId={this.state.uid}
                    postImageUrl={this.state.postItem.imageUrl}
                    postDescription={this.state.postItem.description}
                    postLikes={this.state.postItem.likes}
                    postComments={this.state.postItem.comments}
                />
            </>
        );
    }
}