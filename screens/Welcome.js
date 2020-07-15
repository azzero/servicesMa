import React, { useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';
import { Button, Text } from '../components';
import { AntDesign } from '@expo/vector-icons';

import { AsyncStorage } from 'react-native';
const Welcome = ({ navigation }) => {
  const gettoken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      alert(value);
      if (value != null) {
        // value previously stored
        console.log('storage value 3 : ', value);
      }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <View id='container' style={styles.container}>
      {/* { Header } */}
      <View id='top' style={styles.top}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={styles.title}>ألو</Text>
          <AntDesign name='phone' color='#799f0c' size={32} />
          <Text style={styles.title}>خدمة</Text>
        </View>
        <Text style={styles.subTitle}>نوفر لك أفضل الخدمات القريبة منك</Text>
      </View>
      {/* Header End  */}

      {/* Middle */}

      {/* Middle End  */}

      {/* Buttom */}
      <View id='buttons' style={styles.bottom}>
        <View style={styles.buttonContainer}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button
              startColor={'#ffe000'}
              endColor={'#799f0c'}
              style={styles.button}
              gradient
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text button>تسجيل الدخول</Text>
            </Button>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button
              shadow
              style={styles.button}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text button>للتسجيل اضغظ هنا</Text>
            </Button>
          </View>
        </View>
      </View>
      {/* Button End  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  top: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center'
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom: {
    marginBottom: 30,
    flex: 0.5,
    alignSelf: 'flex-end',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 80,
    fontFamily: customConstants.MaghribiFont,
    color: 'white',
    color: customConstants.GreenLiteColor,
    paddingBottom: 13
  },
  subTitle: {
    color: customConstants.grayColor
  },
  buttonContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  button: {
    width: customConstants.screenWidth - 100,
    marginVertical: 8,
    justifyContent: 'center'
  }
});
export default Welcome;
