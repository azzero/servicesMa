import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import NavigationRoot from './navigation';
import * as customConstants from './constants/constants';
import { Asset } from 'expo-asset';
import { f, database, auth } from './config/config.js';
import UserContext from './context/UserContext';
import DataContext from './context/DataContext';
import LocalisationContext from './context/LocalisationContext';
import { AsyncStorage } from 'react-native';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { decode, encode } from 'base-64';
global.crypto = require('@firebase/firestore');
//-------------- disable setTimeOut warning :

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

global.crypto.getRandomValues = byteArray => {
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = Math.floor(256 * Math.random());
  }
};

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

//--------------------------------

const images = [
  require('./assets/illustrations/online_cv.png'),
  require('./assets/illustrations/phototry.jpg')
];
//---- react native element theme ---- //
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
  I18nManager.forceRTL(true);

  //----------------State Declaration ----------//

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [localisation, setlocalisation] = useState(null);
  const [loadingToken, setloadingToken] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [asklocalisationpopup, setasklocalisationpopup] = useState(false);

  //-------------- User ContextProvider -------------------//
  const providerValue = useMemo(
    () => ({
      logging: { isLoggedIn, setisLoggedIn },
      tokenManager: { token, setToken },
      splash: { loadingToken, setloadingToken }
    }),
    [isLoggedIn, setisLoggedIn, token, setToken, loadingToken, setloadingToken]
  );
  //-------------------Data Context Provider -------------------//
  const DataProvider = useMemo(() => ({ data, setData }), [data, setData]);
  //-------------------Data Context Provider -------------------//
  const LocalisationProvider = useMemo(
    () => ({
      position: { localisation, setlocalisation },
      askingPosition: { asklocalisationpopup, setasklocalisationpopup }
    }),
    [
      localisation,
      setlocalisation,
      asklocalisationpopup,
      setasklocalisationpopup
    ]
  );
  //----------------------Use Effect ------------------------//
  useEffect(() => {
    return async () => {
      f.auth().onAuthStateChanged(async user => {
        if (user) {
          var currentUser = f.auth().currentUser;
          if (currentUser !== null) {
            const userToken = await currentUser.getIdToken();
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
  //--------------- Loading assets -------------//
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
    //---------------- display app --------------//
    return (
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={providerValue}>
          <DataContext.Provider value={DataProvider}>
            <LocalisationContext.Provider value={LocalisationProvider}>
              <NavigationRoot />
            </LocalisationContext.Provider>
          </DataContext.Provider>
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
