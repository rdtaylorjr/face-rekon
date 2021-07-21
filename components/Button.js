import React from 'react'

import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export default function Button ({ title, variant = 'default', disabled, loading, onPress, ...props }) {
  const titleElement = React.isValidElement(title) ? 
    title : 
    (
      <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
        {title}
      </Text>
    )

  return (
    <View style={disabled && styles.disabled}>
      <TouchableHighlight
        style={styles.button} 
        underlayColor="grey" 
        disabled={disabled}
        // style={[
        //   styles.container,
        //   variant === 'primary' && styles.primaryContainer,
        // ]}
        onPress={onPress}
        {...props}
      >
        {loading ? (<ActivityIndicator color="#FFFFFF" size="small" />) : titleElement}
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  // container: {
  //   paddingVertical: 12,
  //   borderRadius: 12,
  // },
  // primaryContainer: {
  //   backgroundColor: "#009688",
  //   alignItems: 'center',
  // },
  // text: {
  //   color: "#0A2540",
  //   fontWeight: '600',
  //   fontSize: 16,
  // },
  // textPrimary: {
  //   color: "#FFFFFF",
  // },
  disabled: {
    opacity: 0.3,
  },
  button: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 25,
    backgroundColor: "#009688",
    width: "70%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
})
