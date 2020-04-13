import React, { useEffect, useContext, useState } from 'react';
import { Text, Input, Button } from '../components';
import { StyleSheet, View, Platform, AppState } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'expo';
import LocalisationContext from '../context/LocalisationContext';
const AskLocalisation = ({ navigation }) => {
  //------------------------------------------------//
  //------------------------state------------------//
  //-----------------------------------------------//
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [appStateNow, setAppStateNow] = useState(AppState.currentState);
  const [EnableLocationServiceAsked, setEnableLocationServiceAsked] = useState(
    false
  );
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  const { asklocalisationpopup, setasklocalisationpopup } = askingPosition;

  //------------------------------------------------//
  //------------------------context------------------//
  //-----------------------------------------------//

  //------------------------------------------------//
  //----------------Open setting Function----------//
  //-----------------------------------------------//
  const openSettingFunction = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
      );
    }
    setOpenSetting(false);
  };
  const goToHome = () => {
    navigation.navigate('Home');
  };
  //------------------------------------------------//
  //---------------get location Async---------------//
  //-----------------------------------------------//
  const getLocationAsync = async () => {
    try {
      let ProviderStatus = Location.hasServicesEnabledAsync();
      const locationIsEnbaled = await ProviderStatus;

      if (!locationIsEnbaled && !EnableLocationServiceAsked) {
        // if (Platform.OS === 'ios') {
        //   setIsLocationModalVisible(true);
        // }
        setIsLocationModalVisible(true);
        setEnableLocationServiceAsked(true);
        return;
      }
      if (!locationIsEnbaled && EnableLocationServiceAsked) {
        setasklocalisationpopup(true);
        // setErrorMessage('لم تسمح لنا بالوصول إلى موقعك');
        goToHome();
        return;
      }
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        setasklocalisationpopup(true);
        goToHome();
        // setErrorMessage('لم يسمح بالولوج للموقع');
        return;
      }
      let lc = await Location.getCurrentPositionAsync({});

      const { longitude, latitude } = lc.coords;
      setLongitude(longitude);
      setLatitude(latitude);
      console.log(`longitude : ${longitude} , latitude ${latitude}`);
      setlocalisation({ longitude, latitude });
      setasklocalisationpopup(true);
      goToHome();
    } catch (e) {
      alert(e);
      setasklocalisationpopup(true);
    }
  };
  //------------------------------------------------//
  //------------------------app State change Handler ------------------//
  //-----------------------------------------------//
  const handleAppStateChange = nextAppState => {
    if (localisation === null) {
      getLocationAsync();
    }
    console.log('AppStateNow :', appStateNow);
    console.log('AppStateNext :', nextAppState);
    setAppStateNow(nextAppState);
  };
  //------------------------------------------------//
  //---------------------Use Effect-----------------//
  //-----------------------------------------------//
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    if (Platform.OS === 'android' && !Constants.isDevice) {
      'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        setErrorMessage('لا يمكن أن يعمل على اندرويد ايميلايتور ');
    }
    // else {
    //   getLocationAsync();
    // }
    return () => {
      // clean listener
      AppState.removeEventListener('change', handleAppStateChange);
      setasklocalisationpopup(true);
    };
  }, []);
  //------------------------------------------------//
  //-----------------------render------------------//
  //-----------------------------------------------//
  return (
    <View style={styles.container}>
      <Modal
        onModalHide={openSetting ? openSettingFunction : undefined}
        isVisible={isLocationModalVisible}
      >
        <View
          style={{
            height: 300,
            width: 300,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          <Text> تحتاج لتفعيل خدمة تحديد الموقع </Text>
          <Button
            gradient
            onPress={() => {
              setIsLocationModalVisible(false);
              setOpenSetting(true);
            }}
          >
            <Text button>للقيام بذلك إضغط هنا</Text>
          </Button>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <View>
          <Text right>لكي نوفر لك أفضل خدمة ممكنة نحتاج الوصول لموقعك</Text>
          <Text right>
            إذا كنت موافقك على استعمال موقعك حسب الشروط المدكورة في الرابط أسفله
            المرجو الضغط
          </Text>
        </View>
        <Button onPress={() => getLocationAsync()} gradient>
          <Text button>هنا</Text>
        </Button>
        <Button
          onPress={() => {
            setasklocalisationpopup(true), navigation.navigate('Home');
          }}
          gradient
        >
          <Text button>أو للذهاب للصفحة الرئيسية إضغط هنا </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%'
  }
});
export default AskLocalisation;
