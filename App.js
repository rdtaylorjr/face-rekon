import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './src/Home'
import Detection from './src/Detection'
import Payment from './src/Payment'
import Registration from './src/Registration'
import Confirmation from './src/Confirmation'
import Capture from './src/Capture'
import Verification from './src/Verification'

const Stack = createStackNavigator()

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Detection" component={Detection} />
          <Stack.Screen name="Capture" component={Capture} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="Confirmation" component={Confirmation} />
          <Stack.Screen name="Registration" component={Registration} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
