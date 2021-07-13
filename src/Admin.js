import React from 'react'
import { StyleSheet, View, Image, Text, TextInput, TouchableHighlight, Keyboard, TouchableWithoutFeedback } from 'react-native'
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
    this.setState({username: input})
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
            placeholder="USERNAME"
            placeholderTextColor={'white'}
            onChangeText={this.validateInput}
            value={this.state.username}
            underlineColorAndroid="transparent"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.button} underlayColor="grey" onPress={this.captureImage}>
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
    fontSize: 25,
    color: "grey",
    textAlign: "center",
    marginTop: 25,
    textTransform: "uppercase"
  },
  input: {
    textAlign: "left",
    paddingLeft: 40,
    marginBottom: 7,
    height: 45,
    borderWidth: 1,
    marginTop: 15,
    borderColor: "#D0D0D0",
    backgroundColor: "grey",
    color: "white",
    borderRadius: 25,
    width: "75%"
  },
  buttonContainer: {
    width: "75%",
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
    // fontSize: 16
  }
})
