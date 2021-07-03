import React from 'react'
import { View } from 'react-native'
import Registration from './Registration'
import Verification from './Verification'

class App extends React.Component {
   render() {
       return (
       <View>
           <Verification />
       </View>
       );
   }
}

export default App;
