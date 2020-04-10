import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Picker,
  Alert,
  Platform,
  AppState
} from 'react-native';
import { Text, Input, Button } from '../components';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { f, fr, geo } from '../config/config';
import { Dropdown } from 'react-native-material-dropdown';
import * as customConstants from '../constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'expo';
import LocalisationContext from '../context/LocalisationContext';

const Service = ({ navigation }) => {
  //---------------Some params ---------------------------//
  const currentUser = f.auth().currentUser;
  //----------------State --------------------------------//
  const [name, setName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [tele, setTele] = useState('');
  const [Description, setDescription] = useState('');
  const [nameErrors, setNameerrors] = useState('');
  const [serviceErrors, setServiceerrors] = useState('');
  const [teleErrors, setTeleerrors] = useState('');
  const [cityErrors, setCityerrors] = useState('');
  const [DescriptionErrors, setDescriptionErrors] = useState('');
  const [city, setCity] = useState('');
  // const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [appStateNow, setAppStateNow] = useState(AppState.currentState);
  const [EnableLocationServiceAsked, setEnableLocationServiceAsked] = useState(
    false
  );
  // const [longitude, setLongitude] = useState(0);
  // const [latitude, setLatitude] = useState(0);
  const [selectedService, setSelectedService] = useState('');
  //------------------------------------------------//
  //-----------------------Context ----------------//
  //-----------------------------------------------//
  const { position } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;

  //------------------ REFERENCES --------------------------//
  const nameRef = React.createRef();
  // const serviceRef = React.createRef();
  const teleRref = React.createRef();
  const DescriptionRref = React.createRef();
  //------------------SetState Handler --------------------//
  const setNameHandler = text => {
    setNameerrors('');
    setName(text);
  };
  const setServiceTitleHandler = text => {
    setServiceerrors('');
    setServiceTitle(text);
  };
  const setTeleHandler = text => {
    setTeleerrors('');
    setTele(text);
  };
  const setDescriptionHandler = text => {
    setDescriptionErrors('');
    setDescription(text);
  };
  const citiesPickerHandler = value => {
    setCityerrors('');
    setCity(value);
  };
  //------------ Pickers handler --------------------//
  // const ServicesPickerHandler = value => {
  //   setSelectedService(value);
  // };
  //------------------------------------------------//
  //------------------validation and insertion------------------//
  //-----------------------------------------------//
  const confirm = () => {
    const validationResult = validate(
      { name: name, service: serviceTitle, tele: tele, city: city },
      constraints.services
    );
    if (typeof validationResult !== 'undefined' && validationResult.name) {
      const error1 = validationResult.name[0];
      setNameerrors(error1);
      nameRef.current.shake();
    }
    if (typeof validationResult !== 'undefined' && validationResult.service) {
      const error2 = validationResult.service[0];
      setServiceerrors(error2);
      // serviceRef.current.shake();
    }
    if (typeof validationResult !== 'undefined' && validationResult.tele) {
      const error3 = validationResult.tele[0];
      setTeleerrors(error3);
      teleRref.current.shake();
    }
    if (typeof validationResult !== 'undefined' && validationResult.city) {
      const error4 = validationResult.city[0];
      setCityerrors(error4);
    }
    if (typeof validationResult === 'undefined') {
      const position = geo.point(localisation.latitude, localisation.longitude);
      fr.collection('services')
        .doc(city)
        .collection(serviceTitle)
        .add({
          name: name,
          Description: Description,
          tele: tele,
          location: position,
          userID: currentUser.uid
        })
        .then(function() {
          Alert.alert(
            'ممتاز !!',
            'تمت الإضافة بنجاح ',
            [
              {
                text: 'البقاء هنا ',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'الرجوع للواجهة الرئيسية',
                onPress: () => navigation.navigate('Home')
              }
            ],
            { cancelable: false }
          );
        })
        .catch(function(error) {
          console.error('Error writing document: ', error);
        });
    }
  };
  //------------------------------------------------//
  //----------------Open setting Function-----------//
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
        if (Platform.OS === 'ios') {
          setIsLocationModalVisible(true);
        }
        setEnableLocationServiceAsked(true);
      }
      if (!locationIsEnbaled && EnableLocationServiceAsked) {
        setErrorMessage('لم تسمح لنا بالوصول إلى موقعك');
        return;
      }
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        setErrorMessage('لم يسمح بالولوج للموقع');
        return;
      }
      let lc = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = lc.coords;
      setlocalisation({ longitude, latitude });
      // setLongitude(longitude);
      // setLatitude(latitude);

      console.log(`longitude : ${longitude} , latitude ${latitude}`);
      setLocation(lc);
    } catch (e) {
      if (Platform.OS !== 'android') {
        alert(e);
      }
    }
  };
  //------------------------------------------------//
  //------------------------app State change Handler ------------------//
  //-----------------------------------------------//
  const handleAppStateChange = nextAppState => {
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
    } else {
      if (localisation === null) {
        getLocationAsync();
      }
    }
    return () => {
      // clean listener
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appStateNow]);
  //------------------------------------------------//
  //-----------------------Render------------------//
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
      <Input
        ref={nameRef}
        inputHandler={setNameHandler}
        errorMessage={nameErrors}
        style={{ color: '#000000' }}
        placeholder='الاسم'
        value={name}
        autoCorrect={false}
      />
      <Dropdown
        label='نوع الخدمة'
        dropdownOffset={{ top: 20, left: 0 }}
        rippleInsets={{ top: 0, bottom: 0 }}
        data={customConstants.services}
        containerStyle={{
          justifyContent: 'center',
          width: '90%',
          paddingLeft: 10
        }}
        onChangeText={value => {
          setServiceTitleHandler(value);
        }}
        pickerStyle={{ borderRadius: 10 }}
        itemTextStyle={{
          borderBottomColor: customConstants.grayColor,
          borderBottomWidth: 1,
          textAlign: 'center',
          paddingBottom: 4,
          margin: 1
        }}
        itemCount={8}
        value={selectedService}
        rippleCentered={true}
        error={serviceErrors}
      />
      <Input
        ref={DescriptionRref}
        errorMessage={DescriptionErrors}
        inputHandler={setDescriptionHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        multiline={true}
        autoCorrect={false}
        numberOflines={4}
        placeholder='وصف الخدمة'
        value={Description}
      />
      <Input
        ref={teleRref}
        errorMessage={teleErrors}
        inputHandler={setTeleHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        placeholder='رقم الهاتف'
        value={tele}
        autoCorrect={false}
      />

      <Dropdown
        label='المدينة'
        data={customConstants.MoroccoCities}
        containerStyle={{
          justifyContent: 'center',
          width: '90%',
          paddingLeft: 10
        }}
        dropdownOffset={{ top: 10, left: 0 }}
        onChangeText={value => {
          citiesPickerHandler(value);
        }}
        pickerStyle={{ borderRadius: 10 }}
        itemTextStyle={{
          borderBottomColor: customConstants.grayColor,
          borderBottomWidth: 1,
          textAlign: 'center',
          paddingBottom: 4,
          margin: 1,
          color: 'green'
        }}
        rippleInsets={{ top: 0, bottom: 0 }}
        itemCount={7}
        value={city}
        rippleCentered={true}
        error={cityErrors}
      />

      <View style={styles.buttonContainer}>
        <Button color='green' onPress={() => confirm()} shadow>
          <Text style={{ color: 'white' }} button>
            {' '}
            أضف{' '}
          </Text>
        </Button>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            {localisation !== null
              ? `your location is :${JSON.stringify(localisation)}`
              : `للأسف  : ${errorMessage}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

//------------------------------------------------//
//----------------------Styling ------------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right'
  },
  buttonContainer: {
    marginVertical: 20,
    width: '50%'
  },
  pickerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'right',
    height: 50,
    width: '100%'
  },
  pickerItem: {
    textAlign: 'center'
  }
});
export default Service;
