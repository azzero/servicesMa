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
const AskLocalisation = ({ navigation, route }) => {
  const { fromScreen } = route.params;
  //------------------------------------------------//
  //------------------------state------------------//
  //-----------------------------------------------//
  const [trackingAppState, settrackingAppState] = useState(null);
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
  //------------------------Ref------------------//
  //-----------------------------------------------//
  const ModelRef = React.createRef();
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
        if (fromScreen) {
          navigation.navigate(fromScreen);
        } else {
          navigation.goBack();
        }
        return;
      }
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        setasklocalisationpopup(true);
        if (fromScreen) {
          navigation.navigate(fromScreen);
        } else {
          navigation.goBack();
        }
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
      console.log('from screen ', fromScreen);
      if (fromScreen) {
        navigation.navigate(fromScreen);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      alert(e);
      setasklocalisationpopup(true);
    }
  };
  //------------------------------------------------//
  //------------------------app State change Handler ------------------//
  //-----------------------------------------------//
  const handleAppStateChange = nextAppState => {
    // setIsLocationModalVisible(false);
    // setAppStateNow(nextAppState);
    // if (localisation === null && nextAppState !== appStateNow) {
    //   getLocationAsync();
    //   console.log('call getlocationAsync inside handle app state');
    // } else {
    //   setAppStateNow(nextAppState);
    // }
    // if (appStateNow === 'background' && nextAppState === 'active') {
    //   console.log('inside checking  ');
    //   getLocationAsync();
    // }
    setAppStateNow(prev => {
      if (
        nextAppState === 'active' &&
        nextAppState !== prev &&
        localisation === null
      ) {
        getLocationAsync();

        return nextAppState;
      } else {
        return nextAppState;
      }
    });

    console.log('AppStateNow inside handler  :', appStateNow);
    console.log('AppStateNext :', nextAppState);
  };
  //------------------------------------------------//
  //---------------------Use Effect-----------------//
  //-----------------------------------------------//
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
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
        ref={ModelRef}
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
      <View style={styles.body}>
        <View>
          {asklocalisationpopup ? (
            <Text style={{ color: 'red' }} center>
              للأسف لم تفعل خدمة الوصول للموقع (GPS ) أعد المحاولة بالضغط على
              الرابط أسفله ، و إذا تعدر الأمر فربما حضرت تطبيقنا من الوصول
              لموقعك أعد السماح للتطبيق من الولوج لموقعك عن طريق إعدادات هاتفك
            </Text>
          ) : null}
          <Text center>لكي نوفر لك أفضل خدمة ممكنة نحتاج الوصول لموقعك</Text>
          <Text center>
            إذا كنت موافقك على استعمال موقعك لنوفر لك أفضل النتائج الممكنة و
            ربطه بالخدمات التي ستقوم بإنشائها مستقبلا ، إضغط على فعل
          </Text>
        </View>
        {/*  buttons  */}
        <View style={styles.buttons}>
          <Button onPress={() => getLocationAsync()} color='#00dd00'>
            <Text button> تفعيل خدمة تحديد المواقع </Text>
          </Button>
          <Text center body>
            * يمكنك تعطيل هذه الخاصية في أي وقت أردت
          </Text>

          {/* <Button
            onPress={() => {
              fromScreen
              ? navigation.navigate(fromScreen)
              : navigation.goBack();
            }}
            gradient
            >
            <Text button>للرجوع إضغط هنا </Text>
          </Button> */}
        </View>
      </View>
      <Button
        rounded
        firstIconName='arrowright'
        style={{ bottom: 50, left: 50 }}
        firstbtnfunction={() => {
          fromScreen ? navigation.navigate(fromScreen) : navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%'
  },
  buttons: {
    marginVertical: 20
  }
});
export default AskLocalisation;
