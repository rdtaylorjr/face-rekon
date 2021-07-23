import React from 'react'
import { View } from 'react-native'
import { PricingCard } from 'react-native-elements'

export default class ConfirmationByBio extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const  amount  = this.props.route.params.paymentAmount
    return(
      <View>
        <PricingCard
        color="#337ab7"
        title="Payment Successful"
        price={amount}
        info={['Verified User by biometeric', 'Thank you for using Face-Rekon!']}
        button={{title:'Home'}}
        onButtonPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    )
  }
  
}