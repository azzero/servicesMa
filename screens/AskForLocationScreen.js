import React, { useEffect, useContext, useState } from 'react';
import { Text, Input, Button } from '../components';
import {
  StyleSheet,
  View,
  Platform,
  AppState,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as customConstants from '../constants/constants';
import Modal from 'react-native-modal';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'expo';
import LocalisationContext from '../context/LocalisationContext';
const AskLocalisation = ({ navigation, route }) => {
  const { fromScreen } = route.params;
  //------------------------------------------------//
  //------------------------state------------------//
  //-----------------------------------------------//
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
  const [Loading, setLoading] = useState(false);

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
        setIsLocationModalVisible(true);
        setEnableLocationServiceAsked(true);
        return;
      }
      // if Im already asked for
      if (!locationIsEnbaled && EnableLocationServiceAsked) {
        setasklocalisationpopup(true);
        if (fromScreen) {
          navigation.navigate(fromScreen);
        } else {
          navigation.goBack();
        }
        return;
      }
      // get permissions
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      setLoading(true);
      if (status !== 'granted') {
        // if it's not granted go back to home screen
        setasklocalisationpopup(true);
        if (fromScreen) {
          navigation.navigate(fromScreen);
        } else {
          navigation.goBack();
        }
        return;
      } else if (status === 'granted') {
        let lc = await Location.getCurrentPositionAsync({});
        setLoading(false);
        const { longitude, latitude } = lc.coords;
        setLongitude(longitude);
        setLatitude(latitude);
        setlocalisation({ longitude, latitude });
        setasklocalisationpopup(true);
        if (fromScreen) {
          navigation.navigate(fromScreen);
        } else {
          navigation.goBack();
        }
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
    setAppStateNow(prev => {
      if (
        nextAppState === 'active' &&
        nextAppState !== prev &&
        localisation === null
      ) {
        // setLoading(true);
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
  if (Loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size='large' color={customConstants.PrimaryColor} />
      </View>
    );
  }
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
              الرابط أسفله ، و إذا تعدر الأمر فربما حضرت التطبيق من الوصول
              لموقعك أعد السماح للتطبيق من الولوج لموقعك عن طريق إعدادات هاتفك
            </Text>
          ) : null}
          <Text center>لكي نوفر لك أفضل خدمة ممكنة نحتاج الوصول لموقعك</Text>
          <Text center>
            انطلاقا من موقعك سنبحث لك عن أقرب مقدمي الخدمات إليك و ربطه بالخدمات
            الخاصة بك إضغط على تفعيل إن كنت موافق
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
