import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import { auth } from '../config/config.js';
const FakeSignUp = async (email, password) => {
  try {
    const response = await auth.createUserWithEmailAndPassword(email, password);
    console.log('response : ', response);
  } catch (e) {
    console.log('error : ', e);
  }
};
const SignUp = () => {
  FakeSignUp('fakeEmail@email.com', 'fakePassword');
  return (
    <View style={styles.container}>
      <Text>SignUp SCREEN</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight
  }
});

export default SignUp;
