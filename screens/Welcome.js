import React, { useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';
import { Button, Text } from '../components';
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
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>خدمات المغرب</Text>
        </View>
        <Text style={styles.subTitle}>مجتمع الخدمات العربي </Text>
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
    // borderColor: 'red',
    // borderWidth: 5,
    flex: 1,
    marginTop: Constants.statusBarHeight,
    flexDirection: 'column',
    alignItems: 'stretch'
    // margin: 5,
    // backgroundColor: customConstants.PrimaryColor
  },
  top: {
    flex: 1,
    // borderColor: 'yellow',
    // borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  middle: {
    // borderColor: 'green',
    // borderWidth: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom: {
    // borderColor: 'blue',
    // borderWidth: 5,
    marginBottom: 30,
    flex: 0.5,
    alignSelf: 'flex-end',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 50,
    fontFamily: customConstants.MaghribiFont,
    color: 'white',
    color: customConstants.GreenLiteColor
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
