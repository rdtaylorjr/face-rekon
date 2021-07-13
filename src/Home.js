import React from 'react'
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native'
import logo from '../assets/icon.png'

export default class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>
          Face-Rekon
        </Text>
        <TouchableHighlight style={[styles.button, styles.blue]} onPress={() => this.props.navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>
            Make Payment
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.button, styles.grey]} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}>
            Register Face (Admin Only)
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 90
  },
  logo: {
    width: 120,
    height: 120
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 25
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    borderRadius: 30,
    marginTop: 25
  },
  blue: {
    backgroundColor: "#337ab7"
  },
  grey: {
    backgroundColor: "#C0C0C0"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
})
