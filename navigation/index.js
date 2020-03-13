import React, { useContext } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InscriptionScreen from '../screens/SignUpScreen';
import Welcome from '../screens/Welcome';
import ForgotScreen from '../screens/ForgotScreen';
import UserContext from '../context/UserContext';
//-------------ROUTERS ------//
const Stack = createStackNavigator();
const StackRouter = () => {
  const { isLoggedIn, setisLoggedIn } = useContext(UserContext);
  console.log('isloggedIn value : ', isLoggedIn);
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
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name='Welcome'
            headerShown={false}
            component={Welcome}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name='SignIn'
            component={LoginScreen}
            options={
              {
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                // animationTypeForReplace: isSignout ? 'pop' : 'push'
              }
            }
          />
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
  return (
    <NavigationContainer>
      <StackRouter />
    </NavigationContainer>
  );
};

export default NavigationRoot;
