import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'

export default class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Face-Rekon
        </Text>
        <TouchableHighlight style={[styles.buttonContainer, styles.button]} onPress={() => this.props.navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>
            Make Payment
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.buttonContainer, styles.button]} onPress={() => this.props.navigation.navigate('Registration')}>
          <Text style={styles.buttonText}>
            Register Face (Admin Only)
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100
  },
  title: {
    fontSize: 30,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: "90%",
    borderRadius: 30,
    marginTop: 20,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#337ab7",
    marginTop: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
