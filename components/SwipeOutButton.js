import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './';
import { Entypo } from '@expo/vector-icons';

const SwipeOutButton = ({ name, color, text }) => {
  return (
    <View style={styles.container}>
      <Entypo name={name} color={color} size={32} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#ffffff'
  }
});

export default SwipeOutButton;
