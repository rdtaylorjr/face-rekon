import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableHighlight } from 'react-native'
import Amplify from 'aws-amplify'

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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter Payment Amount</Text>

        <TextInput
          placeholder="$0.00"
          onChangeText={this.validateInput}
          value={this.state.paymentAmount}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          style={styles.textInput}
        />

        <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.detectLiveness}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableHighlight>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 100
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
  }
})
