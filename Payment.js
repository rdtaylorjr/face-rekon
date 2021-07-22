import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableHighlight, Image } from 'react-native'
import { Dimensions } from "react-native"
import Amplify from 'aws-amplify'
import logo from '../assets/icon.png'
import { hasHardwareAsync, isEnrolledAsync, supportedAuthenticationTypesAsync, authenticateAsync   } from 'expo-local-authentication'

const { width: WIDTH} = Dimensions.get('window')
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

export default class Payment extends React.Component {

  constructor(props) {
    super(props)

    this.validateInput = this.validateInput.bind(this);

    this.state = {
      paymentAmount: ''
    }
  }

  validateInput = input => {
    input = input.replace(/[^0-9]/g, '')
    if (input == '' || input == null || input == undefined || parseInt(input) == 0) {
      this.setState({ paymentAmount: '$0.00' })
    }
    else {
      const currency = "$" + (input / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      this.setState({ paymentAmount: currency })
    }
  }

  detectLiveness = () => {
    if (this.state.paymentAmount == '' || this.state.paymentAmount == '$0' || this.state.paymentAmount == '$0.00' || this.state.paymentAmount == null || this.state.paymentAmount == undefined) {
      alert('Please Enter a Payment Amount')
    }
    else {
      this.props.navigation.navigate('Verification', {
        paymentAmount: this.state.paymentAmount
      })
    }
  }
//********************************************* */

//Added Biometeric Auth Function//  
 biometricsAuth = async () => {
  const compatible = await hasHardwareAsync()
  if (!compatible) throw 'This device is not compatible for biometric authentication'
  
  const enrolled = await isEnrolledAsync()
  if (!enrolled) throw `This device doesn't have biometric authentication enabled`

  const availableMethods = await supportedAuthenticationTypesAsync()
  if(! availableMethods) throw 'Bleh'
  else {
     console.log(availableMethods)
  }
  
  const result = await authenticateAsync()
  if (!result.success) throw `${result.error} - Authentication unsuccessful`
  else{
    if (this.state.paymentAmount == '' || this.state.paymentAmount == '$0' || this.state.paymentAmount == '$0.00' || this.state.paymentAmount == null || this.state.paymentAmount == undefined) {
      alert('Please Enter a Payment Amount')
    }
    else {
      this.props.navigation.navigate('ConfirmationByBio', {
        paymentAmount: this.state.paymentAmount
      })
    }
  }
  
}


  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>
        <Text style={styles.title}>Enter Payment Amount</Text>
        <View style={styles.inputContainer}>
        <TextInput
          placeholder="$0.00"
          onChangeText={this.validateInput}
          value={this.state.paymentAmount}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          style={styles.input}
        />
        </View>
        <View style={styles.inputBody}>
        <TouchableHighlight style={styles.appButtonContainer} onPress={this.detectLiveness}>
          <Text style={styles.appButtonText}>Proceed</Text>
        </TouchableHighlight>
        </View>
        <View>
        <TouchableHighlight style={styles.appButtonContainer} onPress={this.biometricsAuth}>
          <Text style={styles.appButtonText}>BioMetric</Text>
        </TouchableHighlight>
        </View>
        
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems:'center'
  },
  inputBody:{
    padding:20
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
  verifyButton: {
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
  }
})
