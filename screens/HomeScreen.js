import React, { useContext } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { auth } from '../config/config';
import UserContext from '../context/UserContext';
import { AsyncStorage } from 'react-native';
const Home = () => {
  const { logging, tokenManager } = useContext(UserContext);
  const { isLoggedIn, setisLoggedIn } = logging;
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        setisLoggedIn(false);
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
  console.log('token inside home ', tokenManager.token);
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
