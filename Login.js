import React, {Component} from "react"
import { Alert, Dimensions, Platform } from "react-native"
import {
    StyleSheet,
    Text,
    View,
    Image,
    KeyboardAvoidingView,
    Button
} from 'react-native'
import { TextInput } from "react-native-gesture-handler"
import bgImage from '../assets/background.jpg'
import logo from '../assets/icon.png'
import Icon from 'react-native-vector-icons/Ionicons'

const { width: WIDTH} = Dimensions.get('window')

export default class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:''
        }
        defaultAuth = {
            username:'admin',
            password:'admin123'
        }
    }

    loginAuth=()=>{
        if(this.state.username === defaultAuth.username && this.state.password === defaultAuth.password){
            this.props.navigation.navigate('Registration')
        }
        else{
            alert("Security breech/Invalid admin login")
        }
    }


    render(){
        return (
            <KeyboardAvoidingView
            behavior={Platform.OS==='ios'?'padding':null}
            style={{flex:1}}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText}>ADMIN LOGIN</Text>
                </View>

                <View>
                    <Icon  size={28} color={'rgba(255,255,255,0.7)'}  style={styles.inputIcon}/>
                    <TextInput
                    style={styles.input}
                    placeholder={'Username'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    underlineColorAndroid='transparent'
                    onChangeText={username=>this.setState({username})}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder={'password'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    underlineColorAndroid='transparent'
                    secureTextEntry
                    onChangeText = {password=>this.setState({password})}
                    />
                </View>
                <View>
                <Button 
                onPress={this.loginAuth}
                title="Login"
                color="#ff00ff"/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    backgroundContainer:{
        flex:1,
        width:null,
        height:null,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F5FCFF'
    },
    logoText:{
        color: 'black',
        fontSize: 40,
        fontWeight:'500',
        marginTop:10,
        opacity:0.5
    },
    logoContainer:{
        alignItems:'center',

    },
    logo:{
        width:120,
        height:120
    },
    input:{
        width: WIDTH-55,
        height:45,
        borderRadius:25,
        fontSize:16,
        paddingLeft:45,
        backgroundColor:'rgba(0,0,0,0.35)',
        color:'rgba(255,255,255,0.7)',
        marginHorizontal:25
    }
})