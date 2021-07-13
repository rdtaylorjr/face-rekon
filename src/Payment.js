import React from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'

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
          <Text style={styles.title}>Enter Payment Amount</Text>

          <TextInput
            placeholder="$0.00"
            onChangeText={this.validateInput}
            value={this.state.paymentAmount}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableHighlight style={styles.button} onPress={this.detectLiveness}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableHighlight>
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
    fontSize: 25,
    color: "#000",
    textAlign: "center",
    marginTop: 25
  },
  input: {
    textAlign: "center",
    marginBottom: 7,
    height: 45,
    borderWidth: 1,
    marginTop: 25,
    borderColor: "#D0D0D0",
    backgroundColor: "white",
    borderRadius: 5,
    width: "75%"
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 20,
    width: "75%",
    backgroundColor: "#337ab7"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
})
