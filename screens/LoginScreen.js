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
const Login = ({ navigation }) => {
  //----------- initialisation ---------- //
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validation, setValidation] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, setisLoggedIn } = useContext(UserContext);
  // console.log('we set token here ,token value : ', token);
  const onConfirm = () => {
    setIsLoading(true);
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
      await auth.signInWithEmailAndPassword(email, password);
      setisLoggedIn(true);
      // const tokenn = await response.getToken();
      // console.log('access  : ', tokenn);
      // navigation.navigate('Home');
    } catch (error) {
      var errorCode = error.code;
      errorHandler('', errorCode);
    }
  };
  //---------------------------//

  //--------- Login with Facebook --------//
  const loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync('229138198490211');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile']
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const credentials = f.auth.FacebookAuthProvider.credential(token);
        f.auth()
          .signInWithCredential(credentials)
          .then(setisLoggedIn(true))
          .catch(error => {
            alert('Loging with facebook error : ', error);
          });
        // console.log('token is : ', token);
      } else {
        // type === 'cancel'
        alert('هناك خطأ ما أعد المحاولة !');
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  //---------------------------//

  //------- USE EFFECT  ------//
  useEffect(() => {
    if (validation === 1) {
      console.log('sign in validated');
      loginInDb();
      console.log(loginError);
    } else {
      console.log('validation rejected ');
    }
    setIsLoading(false);
  }, [validation, isLoading]);
  //--------------------------//

  return (
    <KeyboardAvoidingView
      style={styles.loginContainer}
      behavior='padding'
      enabled
    >
      <StatusBar barStyle='light-content'></StatusBar>
      <View style={styles.intro}>
        <Text style={styles.introText}>تسجيل الدخول</Text>
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
            style={{
              textAlign: 'center',
              width: '100%',
              color: 'black'
            }}
          >
            تسجيل الدخول
          </Text>
        </Button>
        {/* <Divider
          style={{
            height: 1,
            backgroundColor: '#ffffff',
            width:
              CustomConstants.screenWidth - CustomConstants.screenWidth / 3,
            marginVertical: 10,
            opacity: 0.5
          }}
        /> */}
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
          <Text> الدخول بحساب فايسبوك</Text>
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
            لا تتوفر على حساب ؟{' '}
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

export default Login;
