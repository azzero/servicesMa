import React, { useState, useEffect, useContext } from 'react';
import * as CustomConstants from '../constants/constants';
import { f, auth } from '../config/config.js';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import Constants from 'expo-constants';
import { Input, Text, Divider } from 'react-native-elements';
import Button from '../components/Button';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import UserContext from '../context/UserContext.js';
import { Entypo } from '@expo/vector-icons';
const inputEmailRef = React.createRef();
const inputPasswordRef = React.createRef();
const SignUp = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [username, setUsername] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const { isLoggedIn, setisLoggedIn } = useContext(UserContext);
  const onConfirm = () => {
    if (matchPasswordError !== '') {
      Alert.alert(matchPasswordError);
      return;
    }
    // ----- validation  -------:
    setValidation(1);
    const validationResult = validate(
      { email: email, password: password },
      constraints.login
    );
    if (typeof validationResult !== 'undefined' && validationResult.email) {
      const emailErrors = validationResult.email[0];
      setValidation(0);
      errorHandler(emailErrors, 'email');
    }
    if (typeof validationResult !== 'undefined' && validationResult.password) {
      const passwordErrors = validationResult.password[0];
      setValidation(0);
      errorHandler(passwordErrors, 'password');
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
        <View style={{ position: 'absolute', left: 5, top: 5 }}>
          <Entypo name='check' size={32} color={CustomConstants.fifthColor} />
        </View>
        <View style={{ position: 'absolute', right: 5, top: 5 }}>
          <Entypo name='cross' size={32} color='#fff' />
        </View>
      </View>
      <View style={styles.form}>
        <Input
          ref={inputEmailRef}
          placeholder='اكتب اسمك هنا'
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={
            <Entypo name='user' size={22} color={CustomConstants.fifthColor} />
          }
          onChangeText={handleUsername}
          //   errorMessage={errorMessage !== '' ? errorMessage : ''}
          value={username}
        />
        <Input
          ref={inputEmailRef}
          placeholder='0xxxxxxxxx '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={
            <Entypo name='phone' size={22} color={CustomConstants.fifthColor} />
          }
          onChangeText={handlePhoneNumber}
          //   errorMessage={errorMessage !== '' ? errorMessage : ''}
          value={phoneNumber}
          keyboardType='phone-pad'
        />

        <Divider
          style={{
            height: 0,
            marginVertical: 20
          }}
        />
        <Button gradient onPress={onConfirm} style={styles.button}>
          <Text
            style={{
              textAlign: 'center',
              width: '100%',
              color: 'black'
            }}
          >
            تسجيل
          </Text>
        </Button>
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

export default SignUp;
