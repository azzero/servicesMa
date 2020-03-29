import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { AsyncStorage } from 'react-native';
import UserContext from '../context/UserContext';
const Splash = ({ navigation }) => {
  const { logging, tokenManager, splash } = useContext(UserContext);
  const { token, setToken } = tokenManager;
  const { isLoggedIn, setisLoggedIn } = logging;
  const { loadingToken, setloadingToken } = splash;
  useEffect(() => {
    return async function fetchToken() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken !== undefined) {
          setToken(storedToken);
        }
        setloadingToken(false);
      } catch (e) {
        alert(e);
      }
    };
    fetchToken();
  }, []);
  return (
    <View style={styles.splash}>
      <Text style={{ color: '#fff70a' }}>Loading ... !!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a3261'
  }
});
export default Splash;
