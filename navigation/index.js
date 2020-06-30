import React, { useContext, useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AskForLocation from '../screens/AskForLocationScreen';
import InscriptionScreen from '../screens/SignUpScreen';
import Welcome from '../screens/Welcome';
import ForgotScreen from '../screens/ForgotScreen';
import UserContext from '../context/UserContext';
import AddService from '../screens/AddServiceScreen';
import DisplayServices from '../screens/DisplayServices';
import EditProfile from '../screens/EditProfileScreen';
import SignUpProfile from '../screens/SignUpProfileScreen';
import { AsyncStorage } from 'react-native';
import Rating from '../components/Rating';
//-------------ROUTERS ------//
const Stack = createStackNavigator();

const StackRouter = () => {
  const { tokenManager } = useContext(UserContext);
  const { token, setToken } = tokenManager;
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
        headerRightContainerStyle: {
          alignItems: 'center',
          marginLeft: 15,
          paddingRight: 16
        },
        headerLeftContainerStyle: {
          alignItems: 'center',
          paddingRight: 16
        }
      }}
      mode='modal'
      headerMode='none'
    >
      {token === null ? (
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
          <Stack.Screen name='DisplayServices' component={DisplayServices} />
          <Stack.Screen name='Rating' component={Rating} />
          <Stack.Screen name='Profile' component={ProfileScreen} />
          <Stack.Screen name='AddService' component={AddService} />
          <Stack.Screen name='AskForLocation' component={AskForLocation} />
          <Stack.Screen name='EditProfile' component={EditProfile} />
          <Stack.Screen name='SignUpProfile' component={SignUpProfile} />
        </>
      )}
    </Stack.Navigator>
  );
};
//------------------------------------------------//
//------------------------Splash------------------//
//-----------------------------------------------//

const Splash = () => {
  const { ratingServicesManager } = useContext(UserContext);
  const { ratedServices, setRatedServices } = ratingServicesManager;

  useEffect(() => {
    const getStoredRatedServices = async () => {
      try {
        // get all services ID rated by user
        let RatedServicesList = await AsyncStorage.getItem(
          '@zizuAppStore:services'
        );
        if (RatedServicesList !== null) {
          const list = JSON.parse(RatedServicesList);
          setRatedServices(list);
        }
      } catch (error) {
        console.log('error while getting rated services list ', error);
      }
    };
  }, []);
  return (
    <View style={styles.splash}>
      <ActivityIndicator size='large' />
    </View>
  );
};
// ------------- Main component --------------------------
const NavigationRoot = () => {
  const { splash } = useContext(UserContext);
  const { loadingToken, setloadingToken } = splash;
  if (loadingToken) {
    return <Splash />;
  }
  return (
    <NavigationContainer>
      <StackRouter />
    </NavigationContainer>
  );
};

//------------------------------------------------//
//------------------------Styling------------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a3261'
  }
});
export default NavigationRoot;
