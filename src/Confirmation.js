import React from 'react'
import { View } from 'react-native'
import { PricingCard } from 'react-native-elements'

export default class Confirmation extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { username, amount } = this.props.route.params
    return(
      <View>
        <PricingCard
        color="#337ab7"
        title="Payment Successful"
        price={amount}
        info={['Verified User: ' + username, 'Thank you for using Face-Rekon!']}
        button={{title:'Home'}}
        onButtonPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    )
  }
  
}