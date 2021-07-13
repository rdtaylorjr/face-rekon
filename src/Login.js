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
    this.defaultAuth = {
      username: 'Admin',
      password: 'Admin123'
    }
  }

  loginAuth = () => {
    if (this.state.username === this.defaultAuth.username && this.state.password === this.defaultAuth.password) {
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
          placeholder={'Username'}
          underlineColorAndroid='transparent'
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.input}
          placeholder={'Password'}
          underlineColorAndroid='transparent'
          secureTextEntry
          onChangeText={password => this.setState({ password })}
        />
        <TouchableHighlight style={styles.button} onPress={this.loginAuth}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 70
  },
  logo: {
    width: 120,
    height: 120
  },
  title: {
    fontSize: 25,
    color: "#000",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 10
  },
  input: {
    textAlign: "center",
    marginBottom: 7,
    height: 45,
    borderWidth: 1,
    marginTop: 10,
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
    marginTop: 10,
    width: "75%",
    backgroundColor: "#337ab7"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
})