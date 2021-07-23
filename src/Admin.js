import React from 'react'
import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
import logo from '../assets/icon.png'

export default class Admin extends React.Component {

  constructor(props) {
    super(props)

    this.validateInput = this.validateInput.bind(this);

    this.state = {
      username: ''
    }
  }

  validateInput = input => {
    input = input.replace(/\s+/g, '')
    this.setState({ username: input })
  }

  captureImage = () => {
    if (this.state.username == '' || this.state.username == null || this.state.username == undefined) {
      alert('Please Enter a Username')
    }
    else {
      this.props.navigation.navigate('Registration', {
        username: this.state.username
      })
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Register New Face</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor={'white'}
            onChangeText={this.validateInput}
            value={this.state.username}
            underlineColorAndroid="transparent"
            style={styles.input}
          />
          <TouchableHighlight
            style={styles.button}
            underlayColor="grey"
            onPress={this.captureImage}
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
