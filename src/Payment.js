import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native'
import { initStripe, useStripe } from '@stripe/stripe-react-native'
import logo from '../assets/icon.png'

export default function Payment({ navigation }) {
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } = useStripe()
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')

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
        merchantDisplayName: 'TCS',
        merchantCountryCode: 'US',
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

  const initializePublishableKey = async () => {
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

  const choosePaymentOption = async () => {
    const { error, paymentOption } = await presentPaymentSheet({
      confirmPayment: false
    })

    if (error) {
      console.log('error', error)
    }
    else if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image
      })
    }
    else {
      setPaymentMethod(null)
    }
  }

  const validateInput = useCallback(
    (input) => {
      input = input.replace(/[^0-9]/g, '')
      if (input == '' || input == null || input == undefined || parseInt(input) == 0) {
        setPaymentAmount('$0.00')
      }
      else {
        const currency = '$' + (input / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        setPaymentAmount(currency)
      }
    }, [])

  const proceed = async () => {
    if (!paymentAmount || paymentAmount == '' || paymentAmount == '$0' || paymentAmount == '$0.00') {
      alert('Please Enter a Payment Amount')
    }
    else if (!paymentMethod) {
      alert('Please Enter a Payment Method')
    }
    else {
      setLoading(true)
      const { error } = await confirmPaymentSheetPayment()
      let params = {
        paymentAmount: paymentAmount,
        paymentMethod: paymentMethod,
        error: null
      }

      if (error) {
        params.error = error.message
      }

      navigation.navigate('Biometric', params)

      setLoading(false)
    }
  }

  useEffect(() => {
    initializePaymentSheet()
    initializePublishableKey()
  }, [])

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>

          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Enter Payment Details</Text>

          <TextInput
            placeholder="$0.00"
            placeholderTextColor={'white'}
            onChangeText={validateInput}
            value={paymentAmount}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableHighlight
            style={styles.input}
            underlayColor="grey"
            loading={loading}
            disabled={!paymentSheetEnabled}
            onPress={choosePaymentOption}
          >
            <View>
              {loading &&
                <ActivityIndicator color="white" size="small" />
              }
              {!loading && paymentMethod &&
                <View style={styles.row}>
                  <Image
                    style={styles.image}
                    source={{ uri: `data:image/png;base64,${paymentMethod.image}` }}
                  />
                  <Text style={styles.inputText}>{paymentMethod.label}</Text>
                </View>
              }
              {!loading && !paymentMethod &&
                <Text style={styles.inputText}>Payment Method</Text>
              }
            </View>
          </TouchableHighlight>

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
      </TouchableWithoutFeedback>
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
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 26,
    height: 20,
    marginRight: 5
  },
  input: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 15,
    borderColor: "#D0D0D0",
    backgroundColor: "grey",
    borderRadius: 25,
    width: "70%",
    textAlign: "center",
    color: "white"
  },
  inputText: {
    color: "white"
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
