import React from 'react'
import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
import logo from '../assets/icon.png'

export default class PaymentOld extends React.Component {

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

  proceed = () => {
    if (this.state.paymentAmount == '' || this.state.paymentAmount == '$0' || this.state.paymentAmount == '$0.00' || this.state.paymentAmount == null || this.state.paymentAmount == undefined) {
      alert('Please Enter a Payment Amount')
    }
    else {
      this.props.navigation.navigate('PaymentMethod', {
        paymentAmount: this.state.paymentAmount
      })
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Enter Payment 
          </Text>

          <TextInput
            placeholder="$0.00"
            placeholderTextColor={'white'}
            onChangeText={this.validateInput}
            value={this.state.paymentAmount}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableHighlight 
            style={styles.button} 
            underlayColor="grey" 
            onPress={this.proceed}
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 120,
    height: 120
  },
  title: {
    fontSize: 25,
    color: "grey",
    textAlign: "center",
    marginTop: 25
  },
  input: {
    textAlign: "center",
    height: 45,
    borderWidth: 1,
    marginTop: 25,
    borderColor: "#D0D0D0",
    backgroundColor: "grey",
    color: "white",
    borderRadius: 25,
    width: "70%"
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 25,
    backgroundColor: "#009688",
    width: "70%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
})
