import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Constants from '../constants/constants';
const TextComponent = props => {
  const { style, button, children, ...others } = props;
  const textStyles = [styles.text, button && styles.button, style];
  return (
    <Text style={textStyles} {...others}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    color: Constants.black,
    fontFamily: Constants.ShebaYeFont,
    fontSize: 16
  },
  button: {
    textAlign: 'center'
  }
});

export default TextComponent;
