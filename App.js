import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/Home'
import Payment from './src/Payment'
import Biometric from './src/Biometric'
import Verification from './src/Verification'
import Login from './src/Login'
import Admin from './src/Admin'
import Registration from './src/Registration'
import Confirmation from './src/Confirmation'

const Stack = createStackNavigator()

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Biometric" component={Biometric} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Confirmation" component={Confirmation} options={{ headerLeft: () => null }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

}
