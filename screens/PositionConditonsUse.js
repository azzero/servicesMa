import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const PositionConditions = () => {
  return (
    <View style={styles.container}>
      <Text>شروط استعمال موقعك </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PositionConditions;
