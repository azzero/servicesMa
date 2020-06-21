import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Constants from '../constants/constants';
const TextComponent = props => {
  const {
    style,
    button,
    children,
    white,
    right,
    center,
    h1,
    h2,
    h3,
    body,
    header,
    title,
    ...others
  } = props;
  const textStyles = [
    styles.text,
    button && styles.button,
    right && styles.right,
    center && styles.center,
    white && styles.white,
    h1 && styles.h1,
    h2 && styles.h2,
    h3 && styles.h3,
    body && styles.body,
    header && styles.header,
    title && styles.title,
    style
  ];
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
    fontSize: 16,
    padding: 10
  },
  h1: {
    fontSize: Constants.sizes.h1,
    color: Constants.black,
    letterSpacing: 0,
    lineHeight: Constants.sizes.h1
  },
  h2: {
    fontSize: Constants.sizes.h2
  },
  h3: {
    fontSize: Constants.sizes.h3
  },
  body: {
    fontSize: Constants.sizes.body
  },
  title: {
    fontSize: Constants.sizes.title
  },
  header: {
    fontSize: Constants.sizes.header
  },
  button: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'left'
  },
  center: {
    textAlign: 'center'
  },
  white: {
    color: '#fff'
  }
});

export default TextComponent;
