import React, { useState, useEffect, useContext } from 'react';
import * as Facebook from 'expo-facebook';
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
import { Input, Text, Divider } from 'react-native-elements';
import Button from '../components/Button';
import validate from 'validate.js';
import constraints from '../constants/constraints';
const inputEmailRef = React.createRef();
const inputPasswordRef = React.createRef();
const SignUp = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validation, setValidation] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [matchPasswordError, setMatchPasswordError] = useState('');
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
  const handleEmail = text => {
    setErrorMessage('');
    setemail(text);
  };
  const handlePassword = text => {
    setPasswordError('');
    setpassword(text);
  };
  const handlePasswordConfirmation = text => {
    setConfirmPassword('');
    setConfirmPassword(text);
  };
  //------------ handling errors ------//
  const errorHandler = (error, type) => {
    switch (type) {
      case 'email':
        setErrorMessage(error);
        inputEmailRef.current.shake();
        return;
      case 'password':
        setPasswordError(error);
        inputPasswordRef.current.shake();
        return;
      case 'confirmPassword':
        setMatchPasswordError(error);
        return;
      case 'auth/weak-password': {
        setValidation(0);
        Alert.alert(
          'للأمان ',
          'إستعمل رقم سري قوي  !',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
        return;
      }
      case 'auth/email-already-in-use':
        {
          setValidation(0);
          Alert.alert(
            'تعدر التسجيل ',
            'هذا الإيميل مسجل لدينا  !',

            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
        return;
      case 'auth/invalid-email': {
        setValidation(0);
        Alert.alert(
          'تعدر الدخول ',
          ' المرجو ادخال بريد الكتروني فعال !',

          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
      case 'auth/network-request-failed':
        {
          setValidation(0);
          Alert.alert(
            'تعدر الدخول ',
            ' غير متصل بشبكة الأنترنت  !',

            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
        return;
      default:
        return;
    }
  };
  //---------------------------//
  //------------backend connection -----------//
  const loginInDb = async () => {
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (response) {
        navigation.navigate('SignUpProfile');
      }
    } catch (error) {
      var errorCode = error.code;
      errorHandler('', errorCode);
    }
  };
  //---------------------------//

  //------- USE EFFECT  ------//
  useEffect(() => {
    const emailMatchResult = validate(
      { password: password, confirmPassword: confirmPassword },
      constraints.login
    );
    setMatchPasswordError('');
    if (
      typeof emailMatchResult !== 'undefined' &&
      emailMatchResult.confirmPassword
    ) {
      console.log('confirmation error : ', emailMatchResult.confirmPassword[0]);
      const confirmPasswordError = emailMatchResult.confirmPassword[0];
      setValidation(0);
      errorHandler(confirmPasswordError, 'confirmPassword');
    }
  }, [confirmPassword, password]);

  //---- use effect for db connection after validation  ----//
  useEffect(() => {
    console.log('validation', validation);
    if (validation === 1) {
      loginInDb();
    } else {
      console.log('validation rejected ');
    }
  }, [validation]);
  //--------------------------//

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
        <Text style={styles.introText}>مرحبا بك في موقع خدمات</Text>
      </View>

      <View style={styles.form}>
        <Input
          ref={inputEmailRef}
          placeholder='اكتب بريدك الالكتروني هنا '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={{ type: 'MaterialCommunityIcons', name: 'mail-outline' }}
          onChangeText={handleEmail}
          errorMessage={errorMessage !== '' ? errorMessage : ''}
          value={email}
          keyboardType='email-address'
        />
        <Input
          ref={inputPasswordRef}
          placeholder='أدخل رقمك السري هنا '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          secureTextEntry={true}
          errorMessage={passwordError !== '' ? passwordError : ''}
          onChangeText={handlePassword}
          value={password}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Input
          placeholder='أعد إدخال رقمك السري هنا  '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          secureTextEntry={true}
          errorMessage={matchPasswordError !== '' ? matchPasswordError : ''}
          onChangeText={handlePasswordConfirmation}
          value={confirmPassword}
          autoCapitalize='none'
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

        <Divider
          style={{
            height: 1,
            backgroundColor: '#ffffff',
            width:
              CustomConstants.screenWidth - CustomConstants.screenWidth / 3,
            marginVertical: 10,
            opacity: 0.8
          }}
        />
        <TouchableOpacity
          style={{ marginTop: 10, alignSelf: 'center' }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text
            style={{
              textAlign: 'center',
              width: '100%',
              color: CustomConstants.fourthColor,
              fontSize: 17
            }}
          >
            العودة إلى تسجيل الدخول ؟
          </Text>
        </TouchableOpacity>
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
    marginVertical: 38,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap'
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
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CustomConstants.PrimaryColor
  },
  intro: { marginBottom: 30 },
  input: {
    color: 'white',
    width: '100%',
    textAlign: 'right',
    textDecorationLine: 'none',
    fontFamily: 'openSans',
    fontSize: 18,
    paddingHorizontal: 10
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
