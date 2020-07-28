import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as CustomConstants from '../constants/constants';
import { Text } from '../components';
import LoadingDots from 'react-native-loading-dots';
const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}
    >
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.input}> ألو خدمة ، سوق الخدمات المميزة </Text>
      </View>
      <View>
        <LoadingDots />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    fontFamily: CustomConstants.MaghribiFont,
    fontSize: 30,
    color: CustomConstants.PrimaryColor,
    fontWeight: '300'
  }
});
export default SplashScreen;
