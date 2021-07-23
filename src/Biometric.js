import React from 'react'
import { Alert, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { hasHardwareAsync, isEnrolledAsync, supportedAuthenticationTypesAsync, authenticateAsync } from 'expo-local-authentication'
import logo from '../assets/icon.png'

export default function Payment({ navigation, route }) {

  const verifyWithFace = () => {
    navigation.navigate('Verification', {
      paymentAmount: route.params.paymentAmount,
      paymentMethod: route.params.paymentMethod,
      error: route.params.error
    })
  }

  const verifyWithTouchID = async () => {
    const compatible = await hasHardwareAsync()
    if (!compatible) {
      Alert.alert('Error', 'This device is not compatible for biometric authentication')
      navigation.navigate('Biometric', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        error: route.params.error
      })
    }

    const enrolled = await isEnrolledAsync()
    if (!enrolled) {
      Alert.alert('Error', 'This device doesn\'t have biometric authentication enabled')
      navigation.navigate('Biometric', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        error: route.params.error
      })
    }

    const availableMethods = await supportedAuthenticationTypesAsync()
    if (!availableMethods) {
      Alert.alert('Error', 'No available methods')
      navigation.navigate('Biometric', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        error: route.params.error
      })
    }

    else {
      console.log(availableMethods)
    }

    const result = await authenticateAsync()
    if (!result.success) {
      navigation.navigate('Confirmation', {
        type: 'failed'
      })
    }
    else if (route.params.error) {
      navigation.navigate('Confirmation', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        error: route.params.error,
        type: 'declined'
      })
    }
    else {
      navigation.navigate('Confirmation', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        username: 'TouchID',
        type: 'payment'
      })
    }
  }

  return (
    <View style={styles.container}>

      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Verification Method</Text>

      <TouchableHighlight
        style={styles.button}
        underlayColor="grey"
        onPress={verifyWithFace}
      >
        <Text style={styles.buttonText}>Face Recognition</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        underlayColor="grey"
        onPress={verifyWithTouchID}
      >
        <Text style={styles.buttonText}>Touch ID</Text>
      </TouchableHighlight>
    </View>
  )
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
    marginTop: 25,
    marginBottom: 5
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
