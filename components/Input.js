import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import * as Constants from '../constants/constants';
const InputComponent = React.forwardRef((props, ref) => {
  const { inputHandler, errorMessage, style, ...others } = props;
  const inputStyles = [styles.input, style];
  return (
    <Input
      ref={ref}
      placeholderTextColor={Constants.grayColor}
      inputStyle={inputStyles}
      containerStyle={styles.InputContainer}
      onChangeText={inputHandler}
      errorMessage={errorMessage !== '' ? errorMessage : ''}
      {...others}
    />
  );
});
const styles = StyleSheet.create({
  InputContainer: {
    width: '80%'
  },
  input: {
    color: 'white',
    width: '100%',
    textAlign: 'right',
    textDecorationLine: 'none',

    fontFamily: Constants.ShebaYeFont,
    fontWeight: '800',
    fontSize: 16,
    margin: 1
  }
});

export default InputComponent;
