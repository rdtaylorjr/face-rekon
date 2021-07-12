import React from 'react'
import { StyleSheet, View, Text, TextInput, Image, TouchableHighlight, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Amplify, { API } from 'aws-amplify'
import logo from '../assets/icon.png'

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'face-payment',
        endpoint: 'https://bhwt4vsv86.execute-api.us-east-2.amazonaws.com/face-payment'
      }
    ]
  }
})

export default class Registration extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      capturedImage: ''
    }
  }

  captureImageButtonHandler = async () => {
    await ImagePicker.requestCameraPermissionsAsync()

    let result = await ImagePicker.launchCameraAsync({
      maxWidth: 800,
      maxHeight: 600,
      base64: true
    })

    if (!result.cancelled) {
      this.setState({ capturedImage: result.uri, base64String: result.base64 })
    }

  }

  registerButtonHandler = () => {
    if (this.state.username == '' || this.state.username == undefined || this.state.username == null) {
      alert('Please Enter the Username')
    }
    else if (this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
      alert('Please Capture the Image')
    }
    else {
      const apiName = 'face-payment'
      const path = '/register'

      const init = {
        headers: {
          "Accept": "application/json",
          "X-Amz-Target": "RekognitionService.IndexFaces",
          "Content-Type": "application/x-amz-json-1.1"
        },
        body: JSON.stringify({
          name: this.state.username,
          Image: this.state.base64String
        })
      }

      API.post(apiName, path, init).then(response => {
        if (response.errorMessage) {
          throw response.errorMessage
        }
        Alert.alert('Registration Successful', JSON.stringify(response))
      }).catch(error => {
        Alert.alert('Error', error)
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>
        <Text style={styles.title}>Register Face</Text>

        <TextInput
          placeholder="Enter Username"
          onChangeText={UserName => this.setState({ username: UserName })}
          underlineColorAndroid='transparent'
          style={styles.input}
        />

        {this.state.capturedImage !== "" &&
          <View style={styles.imageHolder} >
            <Image source={{ uri: this.state.capturedImage }} style={styles.previewImage} />
          </View>
        }
        <View style={styles.inputBody}>
        <TouchableHighlight style={styles.appButtonContainer} onPress={this.captureImageButtonHandler}>
          <Text style={styles.appButtonText}>Capture Image</Text>
        </TouchableHighlight>
        </View>
        
        <View>
        <TouchableHighlight style={[styles.appButtonContainer]} onPress={this.registerButtonHandler}>
          <Text style={styles.appButtonText}>Register</Text>
        </TouchableHighlight>
        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputBody:{
    padding:20
  },
  container: {
    marginTop: 100,
    alignItems:'center'
  },
  title: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10
  },
  textInput: {
    textAlign: "center",
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    marginLeft: "5%",
    width: "90%"
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 30,
    marginTop: 20,
    marginLeft: "5%",
    width: "90%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  captureButton: {
    backgroundColor: "#337ab7"
  },
  registerButton: {
    backgroundColor: "#C0C0C0",
    marginTop: 5
  },
  imageHolder: {
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "#eee",
    width: "50%",
    height: 150,
    marginTop: 10,
    marginLeft: 90,
    flexDirection: "row",
    alignItems: "center"
  },
  previewImage: {
    width: "100%",
    height: "100%",
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
  },
  input:{
    width:300,
    height:45,
    borderRadius:25,
    fontSize:16,
    paddingLeft:45,
    backgroundColor:'rgba(0,0,0,0.35)',
    color:'rgba(255,255,255,0.7)',
    marginHorizontal:25
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
logo:{
  width:100,
  height:100
}
})
