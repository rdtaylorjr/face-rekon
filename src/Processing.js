import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { initStripe, useStripe } from '@stripe/stripe-react-native'

export default function Processing({ navigation, route }) {
  const { initPaymentSheet, confirmPaymentSheetPayment } = useStripe()
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [paymentMethod, setPaymentMethod] = useState(route.params.paymentMethod)

  const API_URL = "https://expo-stripe-server-example.glitch.me"

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const { paymentIntent, ephemeralKey, customer } = await response.json()

    return {
      paymentIntent,
      ephemeralKey,
      customer
    }
  }

  const fetchPublishableKey = async (paymentMethod) => {
    try {
      const response = await fetch(
        `${API_URL}/stripe-key?paymentMethod=${paymentMethod}`
      )

      const { publishableKey } = await response.json()

      return publishableKey
    } 
    catch (error) {
      console.warn('Unable to fetch publishable key. Is your server running?')
      Alert.alert('Error', 'Unable to fetch publishable key. Is your server running?')
      return null
    }
  }

  const initializePaymentSheet = async () => {
    setLoading(true)

    try {
      const { error, paymentOption } = await initPaymentSheet({
        customerId: route.params.customer,
        customerEphemeralKeySecret: route.params.ephemeralKey,
        paymentIntentClientSecret: route.params.paymentIntent,
        customFlow: true,
        merchantDisplayName: 'TCS',
        merchantCountryCode: 'US',
        testEnv: true
      })

      // alert(
      //   route.params.paymentIntent + "\n************\n" +
      //   route.params.ephemeralKey + "\n************\n" +
      //   route.params.customer + "\n************\n" +
      //   JSON.stringify(paymentOption) + "\n************\n" +
      //   JSON.stringify(route.params.paymentMethod)
      // )
      
      if (!error) {
        setPaymentSheetEnabled(true)
      }
      // if (paymentOption) {
      //   setPaymentMethod(paymentOption)
      // }
    } 
    catch (error) {
      Alert.alert('Error', error.message)
    } 
    finally {
      setLoading(false)
    }
  }

  const initializePublishableKey = async () =>  {
    const publishableKey = await fetchPublishableKey(route.params.paymentMethod)
    if (publishableKey) {
      await initStripe({
        publishableKey,
        merchantIdentifier: 'merchant.com.stripe.react.native',
        urlScheme: 'stripe-example',
        setUrlSchemeOnAndroid: true
      })
      setLoading(false)
    }
  }

  const proceed = async () => {
    setLoading(true)
    const { error } = await confirmPaymentSheetPayment()

    if (error) {
      Alert.alert(error.message)
      navigation.navigate('Confirmation', {
        paymentMethod: route.params.paymentMethod,
        type: 'declined'
      })
    }
    else {
      setPaymentSheetEnabled(false)
      navigation.navigate('Confirmation', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        username: route.params.username,
        type: 'payment'
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    initializePaymentSheet()
    initializePublishableKey()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.button, (!paymentSheetEnabled) && styles.disabled]} 
        underlayColor="grey" 
        loading={loading}
        disabled={!paymentSheetEnabled}
        onPress={proceed}
      >
        <Text style={styles.buttonText}>Proceed</Text>
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
  },
  disabled: {
    backgroundColor: "#C0C0C0"
  }
})
