import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TouchableHighlight, Alert } from 'react-native'
import Amplify, { API } from 'aws-amplify'

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'face-payment',
        endpoint: 'https://bhwt4vsv86.execute-api.us-east-2.amazonaws.com/face-payment'
      }
    ]
  }
})

export default class Verification extends React.Component {

  constructor(props) {
    super(props)
  }

  verifyFace = () => {
    const { navigation, route } = this.props
    const apiName = 'face-payment'
    const path = '/verify'

    const init = {
      headers: {
        "Accept": "application/json",
        "X-Amz-Target": "RekognitionService.SearchFacesByImage",
        "Content-Type": "application/x-amz-json-1.1"
      },
      body: JSON.stringify({
        name: '',
        Image: route.params.base64String
      })
    }

    API.post(apiName, path, init).then(response => {
      if (response.errorMessage) {
        throw response.errorMessage
      }
      const parsed = JSON.parse(response.body)
      if (JSON.stringify(parsed.FaceMatches.length) > 0) {
        navigation.navigate('Confirmation', {
          username: parsed.FaceMatches[0].Face.ExternalImageId,
          amount: route.params.paymentAmount
        })
      }
      else {
        Alert.alert('Payment Authorization Failed', 'Could Not Verify Face\nPlease Try Again')
      }
    }).catch(error => {
      Alert.alert('Payment Authorization Failed', error)
    })
  }

  render() {
    const { capturedImage } = this.props.route.params
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Verify Face</Text>

          {capturedImage !== "" &&
            <View style={styles.imageHolder} >
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            </View>
          }

          <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.verifyFace()}>
            <Text style={styles.buttonText}>Validate</Text>
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
  textInput: {
    textAlign: "center",
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    marginLeft: "5%",
    width: "90%"
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
  verifyButton: {
    backgroundColor: "#C0C0C0",
    marginTop: 5
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
