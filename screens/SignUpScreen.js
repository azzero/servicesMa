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
import UserContext from '../context/UserContext.js';
const inputEmailRef = React.createRef();
const inputPasswordRef = React.createRef();
const SignUp = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [email, setemail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validation, setValidation] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [matchPasswordError, setMatchPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = () => {
    if (matchPasswordError !== '') {
      Alert.alert(matchPasswordError);
      return;
    }

    // ----- validation  -------:
    setValidation(1);
    const validationResult = validate(
      { email: email, password: password },
      constraints
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
    setValidation(1);
    setConfirmPassword('');
    setConfirmPassword(text);
  };
  //------------ handling errors ------//
  const errorHandler = (error, type) => {
    console.log('error type', type);
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
      case 'auth/user-not-found': {
        setValidation(0);
        Alert.alert(
          'تعدر الدخول ',
          'هذا البريد الالكتروني غير مسجل لدينا ، المرجو التحقق !',
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
      case 'auth/wrong-password':
        {
          setValidation(0);
          Alert.alert(
            'تعدر الدخول ',
            'الرقم السري لا يتوافق مع البريد الإلكتروني ، المرجو التحقق !',

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
      case 'auth/invalid-email':
        {
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
        return;
      default:
        return;
    }
  };
  //---------------------------//
  //------------backend connection -----------//
  const loginInDb = async () => {
    try {
      console.log('db connection phase ');
      // await auth.signInWithEmailAndPassword(email, password);
      // setisLoggedIn(true);
      // const tokenn = await response.getToken();
      // console.log('access  : ', tokenn);
      // navigation.navigate('Home');
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
      constraints
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
  }, [confirmPassword]);

  //---- use effect for db connection after validation  ----//
  useEffect(() => {
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
      behavior='padding'
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
          rightIcon={{ type: 'MaterialCommunityIcons', name: 'mail-outline' }}
          onChangeText={handleEmail}
          errorMessage={errorMessage !== '' ? errorMessage : ''}
          value={email}
        />
        <Input
          ref={inputPasswordRef}
          placeholder='أدخل رقمك السري هنا '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          rightIcon={{ type: 'font-awesome', name: 'lock' }}
          secureTextEntry={true}
          errorMessage={passwordError !== '' ? passwordError : ''}
          onChangeText={handlePassword}
          value={password}
          autoCapitalize='none'
        />
        <Input
          placeholder='أعد إدخال رقمك السري هنا  '
          placeholderTextColor='#bbc3c7'
          inputStyle={styles.input}
          containerStyle={styles.InputContainer}
          rightIcon={{ type: 'font-awesome', name: 'lock' }}
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
              color: 'white',
              fontSize: 17
            }}
          >
            العودة إلى تسجيل الدخول ؟{' '}
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
  // buttonContainer: {
  //   flex: 1,
  //   borderColor: 'yellow',
  //   borderWidth: 3,
  //   width: '100%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginVertical: 20,
  //   marginHorizontal: 20
  // },
  enregistrementText: {
    fontSize: 14,
    color: CustomConstants.fourthColor,
    marginVertical: 20
  }
});

export default SignUp;
