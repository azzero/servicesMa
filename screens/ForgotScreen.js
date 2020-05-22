import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Input, Button, Text } from '../components/index';
import * as CustomConstants from '../constants/constants';
import { auth } from '../config/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const handleEmail = value => {
    setEmail(value);
  };
  const handleSubmission = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function() {
        alert('أرسل الايميل بنجاح !!');
      })
      .catch(function(error) {
        console.log(error);
        alert('هناك خطأ ما ');
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logo}>
          <MaterialCommunityIcons
            size={60}
            color={CustomConstants.fourthColor}
            name='lock-reset'
          />
          <Text style={{ color: CustomConstants.fourthColor, fontSize: 25 }}>
            نسيت كل المرور ؟
          </Text>
        </View>
        <View style={{ width: '90%' }}>
          <Input
            autoFocus={true}
            // ref={inputEmailRef}
            placeholder='اكتب بريدك الالكتروني هنا '
            onChangeText={handleEmail}
            leftIcon={{ type: 'MaterialCommunityIcons', name: 'mail-outline' }}
            // errorMessage={errorMessage}
            value={email}
            keyboardType='email-address'
            style={{
              fontFamily: CustomConstants.BoldFont,
              color: '#000000'
            }}
          />
        </View>
        <View style={{ width: '90%', marginTop: 20 }}>
          <Button gradient onPress={() => handleSubmission()}>
            <Text button>أرسل</Text>
          </Button>
        </View>
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Button
          rounded
          firstbtnfunction={() => {
            navigation.navigate('SignIn');
          }}
          firstIconName='arrowright'
          style={{ bottom: 100, left: 40 }}
        />
      </View>
    </View>
  );
};
export default Forgot;

const styles = StyleSheet.create({
  container: {
    backgroundColor: CustomConstants.PrimaryColor,
    marginTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%'
  }
});
