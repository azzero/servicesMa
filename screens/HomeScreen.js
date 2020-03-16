import React, { useContext } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { auth } from '../config/config';
import UserContext from '../context/UserContext';
import { AsyncStorage } from 'react-native';

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
  const getdata = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      console.log(value);
    } catch (e) {
      console.log('error : ', e);
    }
  };
  return (
    <View>
      <Text>Home screen </Text>
      <Button title='logout' onPress={logout} />
      <Button title='token' onPress={getdata} />
    </View>
  );
};

const styles = StyleSheet.create({});
export default Home;
