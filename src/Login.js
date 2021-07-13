import React from "react"
import { StyleSheet, Text, View, TextInput, Image, TouchableHighlight, Alert } from 'react-native'
import logo from '../assets/icon.png'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    defaultAuth = {
      username: 'Admin',
      password: 'Admin123'
    }
  }

  loginAuth = () => {
    if (this.state.username === defaultAuth.username && this.state.password === defaultAuth.password) {
      this.props.navigation.navigate('Admin')
    }
    else {
      Alert.alert('Login Failed', 'Invalid Username / Password')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Admin Login</Text>
        <TextInput
          style={styles.input}
          placeholder={'USERNAME'}
          placeholderTextColor={'white'}
          underlineColorAndroid='transparent'
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.input}
          placeholder={'PASSWORD'}
          placeholderTextColor={'white'}
          underlineColorAndroid='transparent'
          secureTextEntry
          onChangeText={password => this.setState({ password })}
        />
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button} onPress={this.loginAuth}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 65
  },
  logo: {
    width: 120,
    height: 120
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "black",
    opacity: 0.5,
    textAlign: "center",
    marginTop: 15,
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
    backgroundColor: "black",
    opacity: 0.5,
    color: "white",
    borderRadius: 25,
    width: "81%"
  },
  buttonContainer: {
    width: "81%",
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