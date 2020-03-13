import React, { useContext } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { auth } from '../config/config';
import UserContext from '../context/UserContext';

const Home = () => {
  const { isLoggedIn, setisLoggedIn } = useContext(UserContext);
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        setisLoggedIn(false);
        console.log('lougout succeded');
      })
      .catch(error => {
        console.log('eror', error);
      });
  };
  return (
    <View>
      <Text>Home screen </Text>
      <Button title='logout' onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({});
export default Home;
