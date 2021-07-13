import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import logo from '../assets/icon.png'

export default class Confirmation extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { navigation, route } = this.props
    return(
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        {route.params.type == 'payment' &&
          <View>
            <Text style={styles.title}>
              Payment Successful
            </Text>
            <Text style={styles.amount}>
              {route.params.amount}
            </Text>
            <Text style={styles.username}>
              Verified user: {route.params.username}
            </Text>
            <Text style={styles.message}>
              Thank you for using Face-Rekon!
            </Text>
          </View>
        }

        {route.params.type == 'registration' &&
          <View>
            <Text style={styles.title}>
              Registration Successful
            </Text>
            <Text style={styles.username}>
              Registered user: {route.params.username}
            </Text>
          </View>
        }

        {route.params.type == 'failed' &&
          <View>
            <Text style={styles.title}>
              Payment Failed
            </Text>
            <Text style={styles.username}>
              Could not verify user. Please try again.
            </Text>
          </View>
        }

        <TouchableHighlight 
          style={styles.button} 
          underlayColor="grey" 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>
            Home
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
    fontSize: 25,
    color: "grey",
    textAlign: "center",
    marginTop: 25
  },
  amount: {
    fontSize: 30,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10
  },
  username: {
    color: "grey",
    textAlign: "center",
    marginTop: 10
  },
  message: {
    color: "grey",
    textAlign: "center"
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
