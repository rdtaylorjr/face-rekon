import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import logo from '../assets/icon.png'

export default class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>
          Face-Rekon
        </Text>
        <TouchableHighlight
          style={[styles.button, styles.green]}
          underlayColor="grey"
          onPress={() => this.props.navigation.navigate('Payment')}
        >
          <Text style={styles.buttonText}>
            Make Payment
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, styles.grey]}
          underlayColor="grey"
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>
            Register Face
          </Text>
        </TouchableHighlight>
      </View>
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
    textTransform: "uppercase"
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    borderRadius: 10,
    marginTop: 25
  },
  green: {
    backgroundColor: "#009688"
  },
  grey: {
    backgroundColor: "#C0C0C0"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
})
