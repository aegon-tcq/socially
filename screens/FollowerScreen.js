import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Avatar, TouchableRipple } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore'
import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import UserListItem from '../components/UserListItem'

export default class FollowerScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            usersData: [],
            loading: false
        }
    }

    componentDidMount() {
        if (this.props.route.params.data.length) {

            this.getuserData()
        }
    }

    getuserData = async () => {
        this.setState({ loading: true })

        let followers = this.props.route.params.data
        let users = []

        for (let i = 0; i < followers.length; i++) {
            let d = await firestore().collection('userDetails').doc(followers[i]).get()
            users.push({ ...d.data(), ...{ uid: d.id } })
            if (i === followers.length - 1) {
                this.setState({ usersData: users, loading: false })
            }
        }
    }



    render() {
        switch (this.state.loading) {
            case false:
                return (
                    <>
                        <Header
                            title={this.props.route.params.title}
                            LeftIcon={<TouchableRipple
                                onPress={() => this.props.navigation.goBack()}
                                rippleColor="rgba(0, 0, 0, .32)"
                                borderless={true}
                            >
                                <MaterialCommunityIcons
                                    name='arrow-left'
                                    color='#303233'
                                    size={30}
                                />
                            </TouchableRipple>}
                            RightIcon={<Entypo
                                name='dots-two-vertical'
                                color='#303233'
                                size={30}
                            />}
                        />
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {this.state.usersData.map((user) => (
                                <TouchableRipple
                                    onPress={() => this.props.route.params.navigation.push('ProfileScreen', { uid: user.uid })}
                                    rippleColor="rgba(0, 0, 0, .32)"

                                ><UserListItem
                                        name={user.name}
                                        iconUrl={user.iconUrl}
                                        followers={user.followers.length}
                                    />
                                </TouchableRipple>
                            ))}
                        </ScrollView>


                    </>
                );
            default:
                return <View style={styles.loading} >
                    <ActivityIndicator size='large' color='#303233' />
                </View>
        }
    }
}

const styles = StyleSheet.create({
    search__bar: {
        marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderColor: '#9da5b7'


    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF'
    }
})