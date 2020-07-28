import React, { useState, useContext } from 'react';
import * as Facebook from 'expo-facebook';
import * as CustomConstants from '../constants/constants';
import { f, auth } from '../config/config.js';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { Divider } from 'react-native-elements';
import { Button, Input, Text } from '../components/';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import Constants from 'expo-constants';
import { Icon } from 'react-native-elements';
import SplashScreen from './SplashScreen';

const inputEmailRef = React.createRef();
const inputPasswordRef = React.createRef();
const Login = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validation, setValidation] = useState(1);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  // console.log('we set token here ,token value : ', token);
  const onConfirm = async () => {
    // ----- validation  -------:
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
    if (validationResult === undefined) {
      loginInDb();
    }
  };
  //-------------Validation End ----------//

  //---------- handling inputs & errors  -----------//
  const handleEmail = text => {
    setErrorMessage('');
    setemail(text);
  };
  const handlePassword = text => {
    setPasswordError('');
    setpassword(text);
  };
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
        Alert.alert('نأسف ، وقد خطأ ما ، المرجو إعادة المحاولة ');
        return;
    }
  };
  //---------------------------//
  //------------backend connection -----------//
  const loginInDb = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      const currentUser = f.auth().currentUser;
      console.log('current user : ', currentUser);
    } catch (error) {
      var errorCode = error.code;
      errorHandler('', errorCode);
    }
  };
  //---------------------------//

  //--------- Login with Facebook --------//
  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      await Facebook.initializeAsync('229138198490211');
      const response = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile']
      });
      const { type, token } = response;
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const credentials = f.auth.FacebookAuthProvider.credential(token);
        f.auth()
          .signInWithCredential(credentials)
          .then(() => {
            // setisLoggedIn(true);
            const currentUser = f.auth().currentUser;
            setIsLoading(false);
            console.log('CURRENT USER : ', currentUser);
          })
          .catch(error => {
            alert('وقع خطأ ما المرجو إعادة المحاولة ');
            alert('Loging with facebook error : ', error);
          });
      } else {
        // type === 'cancel'
        alert('هناك خطأ ما أعد المحاولة !');
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  //---------------------------//
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <View style={styles.loginContainer}>
      <StatusBar barStyle='light-content'></StatusBar>
      <View style={styles.intro}>
        <Text style={styles.introText}>تسجيل الدخول</Text>
      </View>

      <View style={styles.form}>
        <Input
          autoFocus={true}
          ref={inputEmailRef}
          placeholder='اكتب بريدك الالكتروني هنا '
          onChangeText={handleEmail}
          leftIcon={{
            type: 'MaterialCommunityIcons',
            name: 'mail-outline',
            color: '#fff'
          }}
          errorMessage={errorMessage}
          value={email}
          keyboardType='email-address'
          style={{
            fontFamily: CustomConstants.BoldFont,
            paddingHorizontal: 10
          }}
        />
        <Input
          ref={inputPasswordRef}
          placeholder='أدخل رقمك السري هنا '
          secureTextEntry={hidePassword}
          onChangeText={handlePassword}
          errorMessage={passwordError}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#fff' }}
          rightIcon={
            <Icon
              name='eye'
              type='font-awesome'
              color='#fff'
              onPress={() => setHidePassword(!hidePassword)}
            />
          }
          value={password}
          autoCapitalize='none'
          autoCorrect={false}
          style={{
            fontFamily: CustomConstants.BoldFont,
            paddingHorizontal: 10
          }}
        />

        <View style={{ ...styles.input, width: '80%' }}>
          <TouchableOpacity
            style={{ marginTop: 5, alignSelf: 'flex-end' }}
            onPress={() => navigation.navigate('Forgot')}
          >
            <Text
              style={{
                textAlign: 'right',
                width: '80%',
                color: CustomConstants.fourthColor,
                fontSize: 14,
                margin: 5
              }}
            >
              نسيت رقمك السري ؟
            </Text>
          </TouchableOpacity>
        </View>

        <Divider
          style={{
            height: 0,
            marginVertical: 20
          }}
        />
        <Button gradient onPress={onConfirm} style={styles.button}>
          <Text
            button
            style={{
              textAlign: 'center'
            }}
          >
            تسجيل الدخول
          </Text>
        </Button>
        <Button
          gradient
          facebook
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 1.0 }}
          // colors={['#4c669f', '#3b5998', '#192f6a']}
          startColor='#4c669f'
          endColor='#3b5998'
          thirdColor='#192f6a'
          locations={[0, 0.5, 0.6]}
          onPress={loginWithFacebook}
          // color='facebook'
          style={styles.button}
        >
          <Text button style={{ color: '#ffffff' }}>
            الدخول بحساب فايسبوك
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
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text
            style={{
              textAlign: 'center',
              width: '100%',
              color: 'white',
              fontSize: 17
            }}
          >
            لا تتوفر على حساب ؟
            <Text
              style={{
                fontWeight: '500',
                color: CustomConstants.fourthColor
              }}
            >
              إضغط هنا للتسجيل
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: 28,
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
    width: '100%',
    flex: 0.7
  },
  error: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red'
  },
  loginContainer: {
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CustomConstants.PrimaryColor
  },
  intro: {
    marginBottom: 10,
    paddingTop: 30
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

export default Login;
