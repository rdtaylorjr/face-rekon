import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native'
import logo from '../assets/icon.png'

export default class Home extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>
        <Text style={styles.title}>
          Face-Rekon
        </Text>
        <View style={styles.inputBody}>
        <TouchableHighlight style={styles.appButtonContainer} onPress={() => this.props.navigation.navigate('Payment')}>
          <Text style={styles.appButtonText}>
            Make Payment
          </Text>
        </TouchableHighlight>  
        </View>
        <View>
        <TouchableHighlight style={styles.appButtonContainer} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.appButtonText}>
            Register Face (Admin Only)
          </Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  inputBody:{
    padding:20
  },
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
    alignSelf:'center'
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  logo:{
    width:120,
    height:120
}
})
