import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as CustomConstants from '../constants/constants';
const DiconnectedScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name='access-point-network-off'
        size={40}
        color='black'
      />
      <Text style={styles.Text}>المرجو الاتصال بالأنترنت !! </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CustomConstants.GreenLiteColor,
    flex: 1
  },
  Text: {
    fontFamily: CustomConstants.ShebaYeFont,
    fontSize: 25,
    marginTop: 25
  }
});

export default DiconnectedScreen;
