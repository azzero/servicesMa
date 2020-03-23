import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as CustomConstants from '../constants/constants';
const Service = props => {
  const { children } = props;

  return <View style={styles.container}>{children}</View>;
};
const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 100,
    backgroundColor: CustomConstants.grayColor,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center'
  }
});
export default Service;
