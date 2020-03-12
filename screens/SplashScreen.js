import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
export default class Splash extends Component {
  render() {
    return (
      <View style={styles.splash}>
        <Text style={{ color: '#fff70a' }}>Loading ... !!</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a3261'
  }
});
