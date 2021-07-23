import React from "react"
import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Admin Login</Text>
          <TextInput
            style={styles.input}
            placeholder={'Username'}
            placeholderTextColor={'white'}
            underlineColorAndroid='transparent'
            onChangeText={username => this.setState({ username })}
          />
          <TextInput
            style={styles.input}
            placeholder={'Password'}
            placeholderTextColor={'white'}
            underlineColorAndroid='transparent'
            secureTextEntry
            onChangeText={password => this.setState({ password })}
          />
          <TouchableHighlight
            style={styles.button}
            underlayColor="grey"
            onPress={this.loginAuth}
          >
            <Text style={styles.buttonText}>Login</Text>
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
    fontSize: 35,
    fontWeight: "600",
    color: "grey",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 5,
    textTransform: "uppercase"
  },
  input: {
    textAlign: "center",
    height: 45,
    borderWidth: 1,
    marginTop: 15,
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
    marginTop: 20,
    backgroundColor: "#009688",
    width: "70%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
})