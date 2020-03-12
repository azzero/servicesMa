import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const Forgot = () => {
  return (
    <View style={styles.container}>
      <Text> Forgoot screen</Text>
    </View>
  );
};
export default Forgot;

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight
  }
});
