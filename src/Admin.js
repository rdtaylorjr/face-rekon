import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableHighlight } from 'react-native'

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
      <View style={styles.container}>
        <Text style={styles.title}>Register New Face</Text>

        <TextInput
          placeholder="Username"
          onChangeText={this.validateInput}
          value={this.state.username}
          underlineColorAndroid="transparent"
          style={styles.input}
        />

        <TouchableHighlight style={styles.button} onPress={this.captureImage}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableHighlight>
      </View>
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
