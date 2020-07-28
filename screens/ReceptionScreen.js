import React, { useContext } from 'react';
import { View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { Text, Button } from '../components';
import * as customConstants from '../constants/constants';
import { AntDesign, Entypo } from '@expo/vector-icons';
import UserContext from '../context/UserContext';
const ReceptionScreen = ({ navigation }) => {
  // comtext
  const { servicesManager } = useContext(UserContext);
  const { services, setServices } = servicesManager;
  // fuctions
  const GoToSearch = () => {
    navigation.navigate('Home');
  };
  const GoToAddService = () => {
    if (services !== null && services.length >= 3) {
      Alert.alert(
        'للأسف',
        ' لقد وصلت للحد الأقصى المسموح به و هو 3 خدمات للشخص الواحد ، إذهب لملفك الشخصي وقم بحدف أو التعديل على إحدى خدماتك ',
        [
          {
            text: 'الرجوع',
            onPress: () => console.log('cancel'),
            style: 'cancel'
          },
          {
            text: 'الملف الشخصي',
            onPress: () => navigation.navigate('Profile')
          }
        ],
        { cancelable: true }
      );
      return;
    }
    navigation.navigate('AddService', {
      is_update: false
    });
  };
  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.first} onPress={GoToSearch}>
        <Button color='fourth' style={styles.button} onPress={GoToSearch}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <AntDesign
              name='search1'
              size={25}
              color={customConstants.PrimaryColor}
            />
            <Text style={styles.firstText}> البحث عن خدمة </Text>
          </View>
        </Button>
      </TouchableHighlight>
      <TouchableHighlight style={styles.second} onPress={GoToAddService}>
        <Button onPress={GoToAddService} color='primary' style={styles.button}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <Entypo name='plus' size={25} color={customConstants.fourthColor} />
            <Text style={styles.secondText}>إضافة خدمة </Text>
          </View>
        </Button>
      </TouchableHighlight>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  first: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: customConstants.PrimaryColor
  },
  firstText: {
    color: customConstants.fourthColor,
    fontFamily: customConstants.ShebaYeFont,
    fontSize: customConstants.sizes.h3,
    color: customConstants.PrimaryColor
    // paddingBottom: 15
  },
  second: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: customConstants.fourthColor
  },
  secondText: {
    color: customConstants.PrimaryColor,
    fontSize: customConstants.sizes.h3,
    fontFamily: customConstants.ShebaYeFont,
    color: customConstants.fourthColor
    // paddingBottom: 15
  },
  button: {
    width: 200,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40
  }
});
export default ReceptionScreen;
