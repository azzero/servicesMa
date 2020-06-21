import React, { useState, useEffect, useContext } from 'react';
import * as CustomConstants from '../constants/constants';
import { fr, f } from '../config/config.js';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { Input, Text, Divider } from 'react-native-elements';
import Button from '../components/Button';
import { Dropdown } from 'react-native-material-dropdown';
import Constants from 'expo-constants';
import constraints from '../constants/constraints';
import validate from 'validate.js';
import { Entypo } from '@expo/vector-icons';
const EditProfile = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [serviceCategory, setServiceCategory] = useState('');
  const [city, setCity] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [serviceErrors, setServiceErrors] = useState(null);
  const [cityErrors, setCityErrors] = useState('');
  //------------- global use ----------------- //
  const { uid } = f.auth().currentUser;
  const userDocRef = fr.collection('users').doc(uid);
  //------------ references ------------------//
  const nameRef = React.createRef();
  const phoneRef = React.createRef();

  // ------------ validation -----------------//
  const onConfirm = () => {
    // ----- validation  -------:
    const validationResult = validate(
      {
        name: username,
        tele: phoneNumber,
        service: serviceCategory,
        city: city
      },
      constraints.services
    );
    if (typeof validationResult !== 'undefined') {
      //unvalide data
      if (validationResult.name) {
        const nameError = validationResult.name[0];
        setUsernameError(nameError);
        nameRef.current.shake();
      }
      if (validationResult.service) {
        const serviceErrorMessage = validationResult.service[0];
        setServiceerrors(serviceErrorMessage);
      }
      if (validationResult.tele) {
        const phoneErrorMessage = validationResult.tele[0];
        setPhoneError(phoneErrorMessage);
        phoneRef.current.shake();
      }
      if (validationResult.city) {
        const cityErrorMessage = validationResult.city[0];
        setCityerrors(cityErrorMessage);
      }
    } else {
      updateProfile();
    }
  };
  //-------------Validation End ----------//

  //---------- handling inputs -----------//
  const handleUsername = text => {
    setUsernameError('');
    setUsername(text);
  };
  const handlePhoneNumber = number => {
    setPhoneError('');
    setPhoneNumber(number);
  };
  const setServiceCategoryHandler = text => {
    setServiceCategory(text);
  };
  const citiesPickerHandler = text => {
    setCity(text);
  };
  //------------------------------------------------//
  //--------------------update Profile--------------//
  //-----------------------------------------------//
  const updateProfile = async () => {
    try {
      await userDocRef.update({
        city,
        name: username,
        service: serviceCategory,
        tele: phoneNumber
      });
      Alert.alert(
        'جيد',
        'تم التعديل بنجاح ',
        [
          {
            text: 'رجوع',
            onPress: () => console.log('cancel pressed'),
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
      console.log('updated');
    } catch (e) {
      console.log('error while updating : ', e);
      alert('وقع خطأ ما أثناء التحديث ، المرجو إعادة المحاولة');
    }
  };
  //------------------------------------------------//
  //------------------------useEffect------------------//
  //-----------------------------------------------//
  useEffect(() => {
    async function getServices() {
      //get all user data by id
      const userInfo = await userDocRef.get();
      const userData = userInfo.data();
      console.log('user data :', userData);
      setCity(userData.city);
      setUsername(userData.name);
      setServiceCategory(userData.service);
      setPhoneNumber(userData.tele);
    }
    getServices();
  }, []);
  //--------------------- Components ------------ //

  return (
    <KeyboardAvoidingView
      style={styles.loginContainer}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffse={15}
      enabled
    >
      <StatusBar barStyle='light-content'></StatusBar>
      <View style={styles.intro}>
        <Text style={styles.introText}>تعديل معلومات حسابك</Text>
        <TouchableOpacity
          onPress={() => {
            onConfirm();
          }}
          style={{ position: 'absolute', left: 5, top: 5 }}
        >
          <View>
            <Entypo name='check' size={32} color={CustomConstants.fifthColor} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={{ position: 'absolute', right: 5, top: 5 }}
        >
          <View>
            <Entypo name='cross' size={32} color='#fff' />
          </View>
        </TouchableOpacity>
      </View>
      {/*---------- form-------  */}
      <View style={styles.form}>
        <Input
          ref={nameRef}
          placeholder='اكتب اسمك هنا'
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={
            <Entypo name='user' size={22} color={CustomConstants.fifthColor} />
          }
          onChangeText={handleUsername}
          errorMessage={usernameError !== '' ? usernameError : ''}
          value={username}
        />
        <Input
          ref={phoneRef}
          placeholder='0xxxxxxxxx '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={
            <Entypo name='phone' size={22} color={CustomConstants.fifthColor} />
          }
          onChangeText={handlePhoneNumber}
          errorMessage={phoneError !== '' ? phoneError : ''}
          value={phoneNumber}
          keyboardType='phone-pad'
        />
        <Dropdown
          label=' نوع الخدمة التي تقدم '
          baseColor='#ffffff'
          itemColor='#ffffff'
          textColor={CustomConstants.fourthColor}
          dropdownOffset={{ top: 20, left: 0 }}
          rippleInsets={{ top: 0, bottom: 0 }}
          data={CustomConstants.services}
          containerStyle={{
            justifyContent: 'center',
            width: '80%',
            paddingHorizontal: 10
          }}
          onChangeText={value => {
            setServiceCategoryHandler(value);
          }}
          pickerStyle={{
            borderRadius: 15,
            backgroundColor: CustomConstants.PrimaryColor,
            borderColor: CustomConstants.fourthColor,
            borderWidth: 1
          }}
          itemTextStyle={{
            fontFamily: CustomConstants.ShebaYeFont,
            textAlign: 'center',
            margin: 1
          }}
          itemCount={8}
          value={serviceCategory}
          rippleCentered={true}
          error={serviceErrors}
        />
        <Dropdown
          label='المدينة'
          baseColor='#ffffff'
          itemColor='#ffffff'
          textColor={CustomConstants.fourthColor}
          data={CustomConstants.MoroccoCities}
          containerStyle={{
            justifyContent: 'center',
            width: '80%',
            paddingHorizontal: 10
          }}
          dropdownOffset={{ top: 20, left: 0 }}
          onChangeText={value => {
            citiesPickerHandler(value);
          }}
          pickerStyle={{
            borderRadius: 15,
            backgroundColor: CustomConstants.PrimaryColor,
            borderColor: CustomConstants.fourthColor,
            borderWidth: 1
          }}
          itemTextStyle={{
            fontFamily: CustomConstants.ShebaYeFont,
            textAlign: 'center',
            margin: 1
          }}
          rippleInsets={{ top: 0, bottom: 0 }}
          itemCount={7}
          value={city}
          rippleCentered={true}
          error={cityErrors}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

//----------------------------------//
//------------Styling -------------
//----------------------------------//
const styles = StyleSheet.create({
  introText: {
    fontFamily: CustomConstants.ShebaYeFont,
    fontSize: 32,
    color: CustomConstants.fourthColor
  },
  form: {
    flex: 0.8,
    // marginVertical: ,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    height: '80%'
  },

  errorContainer: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%'
  },
  error: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red'
  },
  loginContainer: {
    paddingTop: Constants.statusBarHeight + 10,
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: CustomConstants.PrimaryColor
  },
  intro: {
    marginBottom: 30,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: CustomConstants.black
  },
  input: {
    color: 'white',
    width: '100%',
    textAlign: 'right',
    textDecorationLine: 'none',
    fontFamily: 'openSans',
    fontSize: 18,
    margin: 5
  },
  InputContainer: {
    width: '80%'
  },
  button: {
    width: CustomConstants.screenWidth - 100,
    marginVertical: 10,
    justifyContent: 'center'
  },

  enregistrementText: {
    fontSize: 14,
    color: CustomConstants.fourthColor,
    marginVertical: 20
  }
});

export default EditProfile;
