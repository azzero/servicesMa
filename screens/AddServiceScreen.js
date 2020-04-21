import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Picker,
  Alert,
  Platform,
  AppState,
  KeyboardAvoidingView
} from 'react-native';
import UserContext from '../context/UserContext';
import { Text, Input, Button } from '../components';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { f, fr, geo } from '../config/config';
import { Dropdown } from 'react-native-material-dropdown';
import * as customConstants from '../constants/constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'expo';
import LocalisationContext from '../context/LocalisationContext';
import { CheckBox } from 'react-native-elements';
import * as CustomConstants from '../constants/constants';
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
  // const [errorMessage, setErrorMessage] = useState('');
  // const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  // const [openSetting, setOpenSetting] = useState(false);
  // const [appStateNow, setAppStateNow] = useState(AppState.currentState);
  // const [EnableLocationServiceAsked, setEnableLocationServiceAsked] = useState(
  //   false
  // );
  const [isSearchByPosition, setisSearchByPosition] = useState(false);
  // const [longitude, setLongitude] = useState(0);
  // const [latitude, setLatitude] = useState(0);
  // const [selectedService, setSelectedService] = useState('');
  //------------------------------------------------//
  //-----------------------Context ----------------//
  //-----------------------------------------------//
  const { position, askingPosition } = useContext(LocalisationContext);
  const { asklocalisationpopup, setasklocalisationpopup } = askingPosition;
  const { localisation, setlocalisation } = position;

  //------------------ REFERENCES --------------------------//
  const nameRef = React.createRef();
  // const serviceRef = React.createRef();
  const teleRref = React.createRef();
  const DescriptionRref = React.createRef();
  //------------------SetState Handler --------------------//
  const checkButtonHandler = () => {
    if (localisation) {
      setisSearchByPosition(!isSearchByPosition);
    } else {
      navigation.navigate('AskForLocation', { fromScreen: 'AddService' });
    }
  };
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
      let position = null;
      if (isSearchByPosition) {
        position = geo.point(localisation.latitude, localisation.longitude);
      } else {
        position = geo.point(0, 0);
      }
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
  // const openSettingFunction = () => {
  //   if (Platform.OS === 'ios') {
  //     Linking.openURL('app-settings:');
  //   } else {
  //     IntentLauncher.startActivityAsync(
  //       IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
  //     );
  //   }
  //   setOpenSetting(false);
  // };
  // //------------------------------------------------//
  // //---------------get location Async---------------//
  // //-----------------------------------------------//
  // const getLocationAsync = async () => {
  //   try {
  //     let ProviderStatus = Location.hasServicesEnabledAsync();
  //     const locationIsEnbaled = await ProviderStatus;

  //     if (!locationIsEnbaled && !EnableLocationServiceAsked) {
  //       if (Platform.OS === 'ios') {
  //         setIsLocationModalVisible(true);
  //       }
  //       setEnableLocationServiceAsked(true);
  //     }
  //     if (!locationIsEnbaled && EnableLocationServiceAsked) {
  //       setErrorMessage('لم تسمح لنا بالوصول إلى موقعك');
  //       return;
  //     }
  //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //     if (status !== 'granted') {
  //       setErrorMessage('لم يسمح بالولوج للموقع');
  //       return;
  //     }
  //     let lc = await Location.getCurrentPositionAsync({});
  //     const { longitude, latitude } = lc.coords;
  //     setlocalisation({ longitude, latitude });
  //     // setLongitude(longitude);
  //     // setLatitude(latitude);

  //     console.log(`longitude : ${longitude} , latitude ${latitude}`);
  //     setLocation(lc);
  //   } catch (e) {
  //     if (Platform.OS !== 'android') {
  //       alert(e);
  //     }
  //   }
  // };
  // //------------------------------------------------//
  // //------------------------app State change Handler ------------------//
  // //-----------------------------------------------//
  // const handleAppStateChange = nextAppState => {
  //   console.log('AppStateNow :', appStateNow);
  //   console.log('AppStateNext :', nextAppState);
  //   setAppStateNow(nextAppState);
  // };
  //------------------------------------------------//
  //---------------------Use Effect-----------------//
  //-----------------------------------------------//
  useEffect(() => {
    if (asklocalisationpopup && localisation === null) {
      setisSearchByPosition(false);
      alert('للأسف تعدر علينا الوصول لموقعك');
    }
    if (asklocalisationpopup && localisation !== null) {
      console.log('localisation updated', localisation);
      setisSearchByPosition(true);
    }
  }, [asklocalisationpopup, localisation]);
  //------------------------------------------------//
  //-----------------------Render------------------//
  //-----------------------------------------------//
  return (
    <KeyboardAvoidingView behavior='padding' enabled style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <Modal
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
      </Modal> */}
        <View style={styles.form}>
          <Input
            ref={nameRef}
            inputHandler={setNameHandler}
            errorMessage={nameErrors}
            placeholder='الاسم'
            value={name}
            autoCorrect={false}
          />
          <Dropdown
            label='نوع الخدمة'
            baseColor='#ffffff'
            itemColor='#ffffff'
            textColor={customConstants.fourthColor}
            dropdownOffset={{ top: 20, left: 0 }}
            rippleInsets={{ top: 0, bottom: 0 }}
            data={customConstants.services}
            containerStyle={{
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 10
            }}
            onChangeText={value => {
              setServiceTitleHandler(value);
            }}
            pickerStyle={{
              borderRadius: 15,
              backgroundColor: customConstants.PrimaryColor,
              borderColor: customConstants.fourthColor,
              borderWidth: 1
            }}
            itemTextStyle={{
              fontFamily: customConstants.ShebaYeFont,
              textAlign: 'center',
              margin: 1
            }}
            itemCount={8}
            value={serviceTitle}
            rippleCentered={true}
            error={serviceErrors}
          />
          <Input
            ref={DescriptionRref}
            errorMessage={DescriptionErrors}
            inputHandler={setDescriptionHandler}
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
            placeholder='رقم الهاتف'
            value={tele}
            autoCorrect={false}
          />

          <Dropdown
            label='المدينة'
            baseColor='#ffffff'
            itemColor='#ffffff'
            textColor={customConstants.fourthColor}
            data={customConstants.MoroccoCities}
            containerStyle={{
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 10
            }}
            dropdownOffset={{ top: 20, left: 0 }}
            onChangeText={value => {
              citiesPickerHandler(value);
            }}
            pickerStyle={{
              borderRadius: 15,
              backgroundColor: customConstants.PrimaryColor,
              borderColor: customConstants.fourthColor,
              borderWidth: 1
            }}
            itemTextStyle={{
              fontFamily: customConstants.ShebaYeFont,
              textAlign: 'center',
              margin: 1
            }}
            rippleInsets={{ top: 0, bottom: 0 }}
            itemCount={7}
            value={city}
            rippleCentered={true}
            error={cityErrors}
          />

          <CheckBox
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: customConstants.PrimaryColor }}
            textStyle={{ color: '#ffffff' }}
            uncheckedColor='#ff0000'
            checkedColor={customConstants.fourthColor}
            onPress={() => checkButtonHandler()}
            title=' موقعك ليس مربوط بالخدمة '
            checkedTitle='موقعك مربوط بالخدمة'
            checked={isSearchByPosition}
          />

          <View style={styles.buttonContainer}>
            <Button
              color={customConstants.fourthColor}
              onPress={() => confirm()}
              shadow
            >
              <Text style={{ color: '#000000' }} button>
                أضف
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

//------------------------------------------------//
//----------------------Styling ------------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CustomConstants.PrimaryColor
  },
  buttonContainer: {
    marginVertical: 20,
    width: '100%'
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
  },
  form: {
    width: '100%'
  }
});
export default Service;
