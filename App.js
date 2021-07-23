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
import ConfirmationByBio from './src/ConfirmationByBio'

const Stack = createStackNavigator()

const headerStyles = {
  // headerTintColor: "#009688", 
  // headerTitleStyle: {
  //   color: null
  // }
}

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Payment" component={Payment} options={headerStyles} />
          <Stack.Screen name="Biometric" component={Biometric} options={headerStyles} />
          <Stack.Screen name="Verification" component={Verification} options={headerStyles} />
          <Stack.Screen name="Login" component={Login} options={headerStyles} />
          <Stack.Screen name="Admin" component={Admin} options={headerStyles} />
          <Stack.Screen name="Registration" component={Registration} options={headerStyles} />
          <Stack.Screen name="Confirmation" component={Confirmation} options={{headerLeft: ()=> null}} />
          <Stack.Screen name="ConfirmationByBio" component={ConfirmationByBio} options={{headerLeft: ()=> null}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
}
