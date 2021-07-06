import React from 'react'
import HomeScreen from './Home'
import Registration from './Registration'
import Verification from './Verification'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

const MainNavigator = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        Registration: { screen: Registration },
        Verification: { screen: Verification }
    },
    {
        initialRouteName: 'Home',
    }
);

const AppContainer = createAppContainer(MainNavigator)
 
export default class App extends React.Component {
    render() {
        return <AppContainer />
    }
}
