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

        this.currencyInputHandler = this.currencyInputHandler.bind(this);

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
            
            API.post(apiName, path, init).then(response => {
                if (response.errorMessage) {
                    throw response.errorMessage
                }
                const parsed = JSON.parse(response.body)
                if (JSON.stringify(parsed.FaceMatches.length) > 0) {
                    Alert.alert('Payment Successful',
                        'Payment Amount: ' + this.state.paymentAmount + '\n' +
                        'Verified User: ' + parsed.FaceMatches[0].Face.ExternalImageId)
                } 
                else {
                    Alert.alert('Payment Declined', 'Could Not Verify Face\nPlease Try Again')
                }
            }).catch(error => {
                Alert.alert('Payment Declined', error)
            })
        }
    }

    currencyInputHandler = input => {
        if (input == 0 || input == null || input == '') {
            this.setState({ paymentAmount: '' })
        }
        else {
            const number = input.replace(/[^0-9]/g, '')
            const currency = "$" + (number / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            this.setState({ paymentAmount: currency})
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Enter Payment Amount</Text>
                
                    <TextInput
                        placeholder="$0.00"
                        onChangeText={this.currencyInputHandler}
                        value={this.state.paymentAmount}
                        underlineColorAndroid="transparent"
                        style={styles.textInput}
                    />

                    {this.state.capturedImage !== "" && 
                        <View style={styles.imageHolder} >
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
    container: {
        marginTop: 60
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

export default Verification
