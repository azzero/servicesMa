import React, { useContext, useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import Splash from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InscriptionScreen from '../screens/SignUpScreen';
import Welcome from '../screens/Welcome';
import ForgotScreen from '../screens/ForgotScreen';
import UserContext from '../context/UserContext';
import { AsyncStorage } from 'react-native';
//-------------ROUTERS ------//
const Stack = createStackNavigator();
const StackRouter = () => {
  const { logging, tokenManager, splash } = useContext(UserContext);
  const { token, setToken } = tokenManager;
  // console.log('isloggedIn value : ', isLoggedIn);
  console.log('token navigator : ', token);
  useEffect(() => {}, [token]);
  return (
    <Stack.Navigator
      headerMode='screen'
      screenOptions={{
        headerBackImage: () => (
          <Image source={require('../assets/icons/back.png')} />
        ),
        headerStyle: {
          height: 64,
          backgroundColor: '#ffffff',
          borderBottomColor: 'transparent',
          elevation: 0
        },
        headerBackTitle: null,
        headerLeftContainerStyle: {
          alignItems: 'center',
          marginLeft: 15,
          paddingRight: 16
        },
        headerRightContainerStyle: {
          alignItems: 'center',
          paddingRight: 16
        }
      }}
    >
      {token == null ? (
        <>
          <Stack.Screen
            name='Welcome'
            headerShown={false}
            component={Welcome}
            options={{ headerShown: false }}
          />

          <Stack.Screen name='SignIn' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={InscriptionScreen} />
          <Stack.Screen name='Forgot' component={ForgotScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Profile' component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
const NavigationRoot = () => {
  // const { splash } = useContext(UserContext);
  const [loadingToken, setloadingToken] = useState(true);
  console.log('loadingToken : ', loadingToken);

  const Splash = () => {
    const { logging, tokenManager } = useContext(UserContext);
    const { token, setToken } = tokenManager;
    const { isLoggedIn, setisLoggedIn } = logging;
    // const { isLoggedIn, setisLoggedIn } = logging;
    // const { loadingToken, setloadingToken } = splash;
    useEffect(() => {
      console.log('inside splash');
      // return async function fetchToken() {
      // try {
      console.log('inside fetchToken');
      // const storedToken = await
      AsyncStorage.getItem('token').then(value => {
        console.log('value retourned by promise : ', value);
        if (value !== null) {
          setToken(value);
          setisLoggedIn(true);
        }
      });
      setloadingToken(false);
    }, []);
    return (
      <View style={styles.splash}>
        <Text style={{ color: '#fff70a' }}>Loading ... !!</Text>
      </View>
    );
  };
  if (loadingToken) {
    return <Splash />;
  }
  return (
    <NavigationContainer>
      <StackRouter />
    </NavigationContainer>
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
export default NavigationRoot;
