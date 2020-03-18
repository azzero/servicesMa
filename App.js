import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import NavigationRoot from './navigation';
import * as customConstants from './constants/constants';
import { Asset } from 'expo-asset';
import { f, database, auth } from './config/config.js';
import UserContext from './context/UserContext';
import { AsyncStorage } from 'react-native';

const images = [
  require('./assets/illustrations/online_cv.png'),
  require('./assets/illustrations/phototry.jpg')
];
//---- theme ---- //
const theme = {
  Button: {
    raised: true
  },
  Text: {
    style: {
      fontFamily: customConstants.PrimaryFont,
      color: 'white',
      fontSize: 15,
      textAlign: 'center'
    }
  }
};
//----Loading assets pre-lunch---//
// get storage data
// loading root :
const loadingAssets = async () => {
  try {
    await Font.loadAsync({
      openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      openSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
      MaghribiFont: require('./assets/fonts/Maghribi-Font.ttf'),
      ShebaYeFont: require('./assets/fonts/ShebaYe.ttf')
    });

    // const cacheImages = images.map(image => {
    //   return Asset.fromModule(image).downloadAsync();
    // });

    // return Promise.all(cacheImages);
  } catch (e) {
    // error reading value
    console.log('error storage : ', e);
  }
};

//---------------------------APP --------//

export default function App({ navigation }) {
  let value;
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [loadingToken, setloadingToken] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const providerValue = useMemo(
    () => ({
      logging: { isLoggedIn, setisLoggedIn },
      tokenManager: { token, setToken },
      splash: { loadingToken, setloadingToken }
    }),
    [isLoggedIn, setisLoggedIn, token, setToken, loadingToken, setloadingToken]
  );
  useEffect(() => {
    return async () => {
      // if (!isLoggedIn) {
      //   console.log('first time');

      // } else {
      //   console.log('false');
      // }
      f.auth().onAuthStateChanged(async user => {
        if (user) {
          var currentUser = f.auth().currentUser;
          if (currentUser !== null) {
            const userToken = await currentUser.getIdToken();
            console.log('inter');
            try {
              AsyncStorage.setItem('token', userToken);
            } catch (e) {
              console.log('get token error :', e);
            }
            setToken(userToken);
            // store token async
          }
        } else {
          currentUser = null;
          setToken(null);
          AsyncStorage.removeItem('token');
          console.log('no user : ', token);
        }
      });
    };
  }, [isLoggedIn, setisLoggedIn]);

  if (loading) {
    return (
      <AppLoading
        startAsync={loadingAssets}
        onFinish={() => {
          setLoading(false);
        }}
      />
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={providerValue}>
          <NavigationRoot />
        </UserContext.Provider>
      </ThemeProvider>
    );
  }
}

//---styling -----/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
