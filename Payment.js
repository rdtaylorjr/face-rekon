import React, {Component} from 'react'
import { View, Text } from 'react-native'
import { Card, PricingCard } from 'react-native-elements'
class Payment extends React.Component {
   
    render()
    {
        const {username} = this.props.navigation.state.params.data
        const {amount} = this.props.navigation.state.params.data
        return(
            <View>
                <PricingCard
                color="#4f9deb"
                title="Payment Confirmed"
                price={amount}
                info={['Thank you for using Face-Rekon','Successful Payment made']}
                button={{title:'Home'}}
                onButtonPress={()=>this.props.navigation.navigate('Home')}
                />
            </View>
        )
    }
}

export default Payment