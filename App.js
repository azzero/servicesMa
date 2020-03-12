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
const loadingAssets = async () => {
  try {
    await Font.loadAsync({
      openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      openSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
      MaghribiFont: require('./assets/fonts/Maghribi-Font.ttf'),
      ShebaYeFont: require('./assets/fonts/ShebaYe.ttf')
    });
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  } catch (e) {
    console.log('error : ', e);
  }
};

//---------------------------APP --------//

export default function App({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const providerValue = useMemo(() => ({ isLoggedIn, setisLoggedIn }), [
    isLoggedIn,
    setisLoggedIn
  ]);
  useEffect(() => {
    return () => {
      f.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('app cmp , user', user);
          setisLoggedIn(true);
          setToken('faketoken');
          // {accessToken} = user.stsTokenManager;
          // console.log(' app component , user token : ', accessToken);
          // setToken(accessToken);
          console.log(' app com , login ');
        } else {
          console.log('app com , logout ');
          alert('هناك خطأ ما ');
        }
      });
    };
  }, [isLoggedIn, setisLoggedIn]);

  if (loading) {
    return (
      <AppLoading
        startAsync={loadingAssets}
        onFinish={() => setLoading(false)}
      />
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={providerValue}>
          <NavigationRoot token={token} isLoggedIn={isLoggedIn} />
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
