import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableHighlight } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export default class Capture extends React.Component {

  constructor(props) {
    super(props)
  }

  captureImage = async () => {
    const { navigation, route } = this.props
    await ImagePicker.requestCameraPermissionsAsync()

    let result = await ImagePicker.launchCameraAsync({
      maxWidth: 800,
      maxHeight: 600,
      base64: true
    })

    if (!result.cancelled) {
      navigation.navigate('Verification', {
        paymentAmount: route.params.paymentAmount,
        capturedImage: result.uri,
        base64String: result.base64
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Capture Image</Text>

          <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImage}>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 100
  },
  title: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 30,
    marginTop: 20,
    marginLeft: "5%",
    width: "90%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  captureButton: {
    backgroundColor: "#337ab7"
  },
  imageHolder: {
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "#eee",
    width: "50%",
    height: 150,
    marginTop: 10,
    marginLeft: 90,
    flexDirection: "row",
    alignItems: "center"
  },
  previewImage: {
    width: "100%",
    height: "100%",
  }
})
