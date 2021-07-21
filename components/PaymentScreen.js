import { initStripe } from '@stripe/stripe-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'

export default function PaymentScreen({ paymentMethod, children }) {
  const [loading, setLoading] = useState(true)

  // const API_URL = "https://face-rekon.glitch.me"
  const API_URL = "https://expo-stripe-server-example.glitch.me"

  async function fetchPublishableKey(paymentMethod) {
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

  useEffect(() => {
    async function initialize() {
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
    initialize()
  }, [])

  // return 
  // loading ? 
  //   ( <ActivityIndicator size="large" style={StyleSheet.absoluteFill} /> ) : 
  return (
    <View
      accessibilityLabel="payment-screen"
      style={styles.container}
      keyboardShouldPersistTaps="handled">
      {children}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
})
