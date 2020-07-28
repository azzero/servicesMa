import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import NavigationRoot from './navigation';
import * as customConstants from './constants/constants';
import { f, fr } from './config/config.js';
import UserContext from './context/UserContext';
import DataContext from './context/DataContext';
import LocalisationContext from './context/LocalisationContext';
import { YellowBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Diconnected from './screens/DiconnectedScreen';
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
  } catch (e) {
    // error reading value
    console.log('error storage : ', e);
  }
};

//---------------------------APP --------//
// RTL configuration
export default function App({ navigation }) {
  I18nManager.forceRTL(true);

  //----------------State Declaration ----------//

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [localisation, setlocalisation] = useState(null);
  const [loadingToken, setloadingToken] = useState(true);
  const [ratedServices, setRatedServices] = useState(null);
  const [asklocalisationpopup, setasklocalisationpopup] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [services, setServices] = useState(null);
  //-------------- User ContextProvider -------------------//
  const providerValue = useMemo(
    () => ({
      tokenManager: { token, setToken },
      splash: { loadingToken, setloadingToken },
      ratingServicesManager: { ratedServices, setRatedServices },
      servicesManager: { services, setServices }
    }),
    [
      token,
      setToken,
      loadingToken,
      setloadingToken,
      ratedServices,
      setRatedServices,
      services,
      setServices
    ]
  );
  // ----------------- get services function --------------------//
  const getServices = async uid => {
    console.log('user ID : ', uid);
    const userDocRef = fr.collection('users').doc(uid);
    const servicesList = await userDocRef.collection('services').get();
    if (servicesList.docs.length) {
      console.log('service tool app : ', servicesList.docs);
      setServices(servicesList.docs);
    } else {
      console.log('document doesnt exist ');
    }
    console.log('services in app : ', services);
  };
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
    const displaySplash = async () => await SplashScreen.preventAutoHideAsync();
    // subscribe for network state
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
    // auth subscribe
    const authSubscription = f.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        const { uid } = f.auth().currentUser;
        getServices(uid);
        setToken(authUser);
      } else {
        setToken(null);
        setServices(null);
        setlocalisation(null);
        setData(null);
        setasklocalisationpopup(false);
      }
      setloadingToken(false);
    });

    return () => {
      displaySplash();
      authSubscription();
      unsubscribe();
    };
  }, [isConnected]);

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
  } else if (!isConnected) {
    // if it's diconnected from the internet
    return <Diconnected />;
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
