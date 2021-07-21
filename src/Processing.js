import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { initStripe, useStripe } from '@stripe/stripe-react-native'

export default function Processing({ navigation, route }) {
  const { initPaymentSheet, confirmPaymentSheetPayment } = useStripe()
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(route.params.paymentMethod)

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
    catch (e) {
      console.warn('Unable to fetch publishable key. Is your server running?')
      Alert.alert(
        'Error',
        'Unable to fetch publishable key. Is your server running?'
      )
      return null
    }
  }

  const initializePaymentSheet = async () => {
    setLoading(true)

    try {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = await fetchPaymentSheetParams()

      const { error, paymentOption } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        customFlow: true,
        merchantDisplayName: 'Face-Rekon',
        applePay: true,
        merchantCountryCode: 'US',
        style: 'alwaysDark',
        googlePay: true,
        testEnv: true
      })

      if (!error) {
        setPaymentSheetEnabled(true)
      }
      if (paymentOption) {
        setPaymentMethod(paymentOption)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const initializePublishableKey = async () =>  {
    const publishableKey = await fetchPublishableKey(paymentMethod)
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

    if (!error) {
      setPaymentSheetEnabled(false)
      // alert(
      //   JSON.stringify(route.params.paymentAmount) + "\n" + 
      //   JSON.stringify(route.params.paymentMethod)
      // )
      navigation.navigate('Confirmation', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        username: route.params.username,
        type: 'payment'
      })
    }
    else {
      navigation.navigate('Confirmation', {
        paymentMethod: route.params.paymentMethod,
        type: 'declined'
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
