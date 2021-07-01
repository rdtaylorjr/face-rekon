import React from 'react'
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

class Register extends React.Component {

    constructor(props){
        super(props)
        this.state = {
           username : '',
           capturedImage : ''
        }
    }

    captureImageButtonHandler = async () => {
        await ImagePicker.requestCameraPermissionsAsync()
        
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          })
      
          console.log(result)
      
          if (!result.cancelled) {
            this.setState({ capturedImage: result.uri })
          }
    }

   render() {
       return (
           <View style={styles.MainContainer}>
               <ScrollView>
                   <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15, marginTop: 10 }}>Register Face</Text>
              
                   <TextInput
                       placeholder="Enter Username"
                       onChangeText={UserName => this.setState({username: UserName})}
                       underlineColorAndroid='transparent'
                       style={styles.TextInputStyleClass}
                   />
                   
                   {this.state.capturedImage !== "" && 
                        <View style={styles.imageholder} >
                            <Image source={{uri : this.state.capturedImage}} style={styles.previewImage} />
                        </View>
                    }
                  

                   <TouchableHighlight style={[styles.buttonContainer, styles.captureButton]} onPress={this.captureImageButtonHandler}>
                       <Text style={styles.buttonText}>Capture Image</Text>
                   </TouchableHighlight>

                   <TouchableHighlight style={[styles.buttonContainer, styles.submitButton]}>
                       <Text style={styles.buttonText}>Submit</Text>
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
     textAlign: 'center',
     marginBottom: 7,
     height: 40,
     borderWidth: 1,
     margin: 10,
     borderColor: '#D0D0D0',
     borderRadius: 5 ,
   },
   inputContainer: {
     borderBottomColor: '#F5FCFF',
     backgroundColor: '#FFFFFF',
     borderRadius:30,
     borderBottomWidth: 1,
     width:300,
     height:45,
     marginBottom:20,
     flexDirection: 'row',
     alignItems:'center'
   },
   buttonContainer: {
     height:45,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom:20,
     width:"80%",
     borderRadius:30,
     marginTop: 20,
     marginLeft: 5,
   },
   captureButton: {
     backgroundColor: "#337ab7",
     width: 350,
   },
   buttonText: {
     color: 'white',
     fontWeight: 'bold',
   },
   horizontal: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     padding: 10
   },
   submitButton: {
     backgroundColor: "#C0C0C0",
     width: 350,
     marginTop: 5,
   },
   imageholder: {
     borderWidth: 1,
     borderColor: "grey",
     backgroundColor: "#eee",
     width: "50%",
     height: 150,
     marginTop: 10,
     marginLeft: 90,
     flexDirection: 'row',
     alignItems:'center'
   },
   previewImage: {
     width: "100%",
     height: "100%",
   }
});

export default Register;
