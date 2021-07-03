import React from 'react'
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
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

class Verification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            capturedImage: ''
        }
    }

    captureImageButtonHandler = async () => {
        await ImagePicker.requestCameraPermissionsAsync()
        
        let result = await ImagePicker.launchCameraAsync({
            maxWidth: 800, 
            maxHeight: 600,
            base64: true
        })

        if (!result.cancelled) {
            this.setState({ capturedImage: result.uri, base64String: result.base64 })
        }

    }

    verifyButtonHandler = () => {
        if (this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
            alert('Please Capture the Image')
        } 
        else {
            const apiName = 'face-payment'
            const path = '/verify'
            
            const init = {
                headers: {
                    "Accept": "application/json",
                    "X-Amz-Target": "RekognitionService.SearchFacesByImage",
                    "Content-Type": "application/x-amz-json-1.1"
                },
                body: JSON.stringify({
                    name: this.state.username,
                    Image: this.state.base64String
                })
            }
            
            API.post(apiName, path, init).then(response => {
                if (JSON.stringify(response.FaceMatches.length) > 0) {
                    alert(response.FaceMatches[0].Face.ExternalImageId)
                } 
                else {
                    alert('No Matches Found')
                }
            })
        }
    }

  
  
    render() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView>
                    <Text style= {{ fontSize: 20, color: "#000", textAlign: "center", marginBottom: 15, marginTop: 10 }}>Verify Face</Text>
                
                    {this.state.capturedImage !== "" && 
                        <View style={styles.imageholder} >
                            <Image source={{uri: this.state.capturedImage}} style={styles.previewImage} />
                        </View>
                    }

                    <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                        <Text style={styles.buttonText}>Capture Image</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.verifyButton]} onPress={this.verifyButtonHandler}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        width: "80%",
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 10
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    captureButton: {
        backgroundColor: "#337ab7",
        width: 300
    },
    verifyButton: {
        backgroundColor: "#C0C0C0",
        width: 300,
        marginTop: 5
    },
    imageholder: {
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

export default Verification
