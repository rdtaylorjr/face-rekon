import React from 'react'
import { StyleSheet, View, Image, Text, TextInput, TouchableHighlight, Keyboard, TouchableWithoutFeedback } from 'react-native'
import logo from '../assets/icon.png'

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Enter Payment Amount</Text>

          <TextInput
            placeholder="$0.00"
            placeholderTextColor={'white'}
            onChangeText={this.validateInput}
            value={this.state.paymentAmount}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.button} onPress={this.detectLiveness}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100
  },
  logo: {
    width: 120,
    height: 120
  },
  title: {
    fontSize: 21,
    color: "grey",
    textAlign: "center",
    marginTop: 25,
    textTransform: "uppercase"
  },
  input: {
    textAlign: "right",
    paddingRight: 40,
    marginBottom: 7,
    height: 45,
    borderWidth: 1,
    marginTop: 15,
    borderColor: "#D0D0D0",
    backgroundColor: "black",
    opacity: 0.5,
    color: "white",
    borderRadius: 25,
    width: "80%"
  },
  buttonContainer: {
    width: "80%",
    paddingHorizontal: 40
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#009688"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16
  }
})
