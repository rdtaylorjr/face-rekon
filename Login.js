import React, {Component} from "react"
import { Dimensions, Platform } from "react-native"
import {
    StyleSheet,
    Text,
    View,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native'
import { TextInput } from "react-native-gesture-handler"

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
            style={[{flex:1}, styles.container]}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                    <Text style={styles.logoText}>ADMIN LOGIN</Text>
                </View>
                <Icon  size={28} color={'rgba(255,255,255,0.7)'}  style={styles.inputIcon}/>
               
                <View style={styles.inputContainer}>
                    
                    <TextInput
                    style={styles.input}
                    placeholder={'Username'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    underlineColorAndroid='transparent'
                    onChangeText={username=>this.setState({username})}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.input}
                    placeholder={'Password'}
                    placeholderTextColor={'rgba(255,255,255,0.7)'}
                    underlineColorAndroid='transparent'
                    secureTextEntry
                    onChangeText = {password=>this.setState({password})}
                    />
                </View>
                <View>
               
                <TouchableOpacity  onPress={this.loginAuth} style={styles.appButtonContainer}>
                    <Text style={styles.appButtonText}>Login</Text>
                </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 100
      },
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
        width: WIDTH-100,
        height:45,
        borderRadius:25,
        fontSize:16,
        paddingLeft:45,
        backgroundColor:'rgba(0,0,0,0.35)',
        color:'rgba(255,255,255,0.7)',
        marginHorizontal:-10
    },
    inputContainer:{
        width:"80%",
      //  backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
      appButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: 200,
        alignSelf:'center'
      },
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})