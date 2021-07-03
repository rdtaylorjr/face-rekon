import React from 'react'
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight, Alert } from 'react-native'
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
        if (this.state.paymentAmount == '' || this.state.paymentAmount == undefined || this.state.paymentAmount == null) {
            alert('Please Enter the Payment Amount')
        } 
        else if (this.state.capturedImage == '' || this.state.capturedImage == undefined || this.state.capturedImage == null) {
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
            
            API.post(apiName, path, init).then(res => {
                alert(res.body)
                const response = JSON.parse(res.body)
                if (JSON.stringify(response.FaceMatches.length) > 0) {
                    Alert.alert('Payment Successful',
                        'Payment Amount: $' + this.state.paymentAmount + '\n' +
                        'Verified User: ' + response.FaceMatches[0].Face.ExternalImageId)
                } 
                else {
                    Alert.alert('Payment Declined', 'Could Not Verify Face\nPlease Try Again')
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <ScrollView>
                    <Text style= {{ fontSize: 20, color: "#000", textAlign: "center", marginBottom: 15, marginTop: 10 }}>Payments</Text>
                
                    <TextInput
                        placeholder="Enter Payment Amount"
                        onChangeText={PaymentAmount => this.setState({paymentAmount: PaymentAmount})}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />

                    {this.state.capturedImage !== "" && 
                        <View style={styles.imageholder} >
                            <Image source={{uri: this.state.capturedImage}} style={styles.previewImage} />
                        </View>
                    }

                    <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                        <Text style={styles.buttonText}>Capture Image</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, styles.verifyButton]} onPress={this.verifyButtonHandler}>
                        <Text style={styles.buttonText}>Make Payment</Text>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    MainContainer: {
        marginTop: 60
    },
    TextInputStyleClass: {
        textAlign: "center",
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        margin: 10,
        borderColor: "#D0D0D0",
        borderRadius: 5
    },
    // inputContainer: {
    //     borderBottomColor: '#F5FCFF',
    //     backgroundColor: '#FFFFFF',
    //     borderRadius: 30,
    //     borderBottomWidth: 1,
    //     width: 300,
    //     height: 45,
    //     marginBottom: 20,
    //     flexDirection: "row",
    //     alignItems: "center"
    // },
    // container: {
    //     flex: 1,
    //     backgroundColor: "white",
    //     alignItems: "center",
    //     justifyContent: "center"
    // },
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
