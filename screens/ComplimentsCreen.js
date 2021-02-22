import React, { Component, useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Avatar, TouchableRipple } from 'react-native-paper';
import Header from '../components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

export default class ComplimentsCreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            compliments: this.props.route.params.data,
            complimentData: [],
            addComplimentsText: ''
        }
    }

    componentDidMount() {
        if (this.state.compliments.length) {
            this.getComplimentsData()
        }
    }
    pUw3RfoloVbnL8VqZj7ZOpVCpyW2


    getComplimentsData = () => {
        this.setState({ loading: true })
        let data = []
        this.state.compliments.map(async (compliment) => {
            await firestore().collection('userDetails').doc(compliment.uid).get()
                .then((snap) => data.push({
                    name: snap.data().name,
                    iconUrl: snap.data().iconUrl,
                    uid: compliment.uid,
                    compliment: compliment.compliment
                }))
            if (this.state.compliments.indexOf(compliment) === this.state.compliments.length - 1) {
                this.setState({ complimentData: data, loading: false })
            }

        })
    }
    textInputChange = (val) => {
        console.log(this.state.complimentData)
        this.setState({
            addComplimentsText: val
        })

    }

    handleAddCompliment = () => {
        this.setState({ loading: true })

        let x = this.state.compliments
        x.push({ compliment: this.state.addComplimentsText, uid: auth().currentUser.uid })
        this.setState({
            compliments: x,
            addComplimentsText: '',
            loading: true
        }, () => firestore().collection('userDetails').doc(this.props.route.params.propsid).update({
            compliments: x,
        }).then(() => this.getComplimentsData())
        )
    }
    render() {
        return (
            <>
                <Header
                    title={'Compliments'}
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
                <View style={styles.main}>
                    {this.state.loading ?
                        <ActivityIndicator size='large' color='#666' />
                        :
                        <ScrollView>
                            {this.state.complimentData.map((compliment) => (
                                <View style={styles.comment__section} >
                                    <Avatar.Image size={30} source={{ uri: compliment.iconUrl }} />
                                    <View>
                                        <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>{compliment.name}</Text>
                                        <Text style={{ marginLeft: 15 }}>{compliment.compliment}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>}
                    {this.props.route.params.myprofile ? null :
                        <View style={styles.add_comment} >
                            <TextInput
                                placeholder="Give a Compliment..."
                                value={this.state.addComplimentsText}
                                placeholderTextColor="#666666"
                                autoCapitalize="none"
                                onChangeText={this.textInputChange}
                            />
                            {this.state.addComplimentsText.trim().length ?
                                <TouchableRipple
                                    onPress={() => this.handleAddCompliment()}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <Text style={{ color: '#000' }} >Post</Text>
                                </TouchableRipple> :
                                <TouchableRipple
                                    onPress={() => { }}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <Text style={{ color: '#666' }} >Post</Text>
                                </TouchableRipple>}
                        </View>}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between'
    },
    comment__section: {
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#666',
        borderBottomWidth: 0.5,
        padding: 5
    },
    add_comment: {
        borderTopColor: '#666',
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    }
})