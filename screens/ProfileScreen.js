import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { f, fr } from '../config/config';
import { Button, Text } from '../components';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';
const Profile = ({ navigation }) => {
  const [services, setServices] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const renderServices = () => {
    const response = services.map(service => {
      return (
        <View style={styles.displayService} key={service.id}>
          <Text style={{ color: '#fff' }}>الإسم : {service.data().name} </Text>
          <Text style={{ color: '#fff' }}>
            الخدمة:
            {service.data().CategoryName}
          </Text>
          <Text style={{ color: '#fff' }}> الهاتف: {service.data().tele}</Text>
          <Text style={{ color: '#fff' }}>
            المدينة:
            {service.data().cityName}
          </Text>
        </View>
      );
    });
    return <View>{response}</View>;
  };

  //------------------------------------------------//
  //-------------------Use Efeect-------------------//
  //-----------------------------------------------//
  useEffect(() => {
    try {
      async function getServices() {
        const { uid } = f.auth().currentUser;
        const userDocRef = fr.collection('users').doc(uid);
        const servicesList = await userDocRef.collection('services').get();
        const userInfo = await userDocRef.get();
        setUserProfile(userInfo.data());
        if (servicesList.docs.length) {
          setServices(servicesList.docs);
          servicesList.docs.forEach(doc => {
            console.log('document : ', doc.data());
          });
        } else {
          console.log('document doesnt exist ');
        }
      }
      getServices();
    } catch (e) {
      console.log('error : ', e);
    }
  }, []);

  //------------------------------------------------//
  //-----------------------Render------------------//
  //-----------------------------------------------//
  return (
    <View style={styles.container}>
      {/* top  */}
      <View style={styles.top}>
        <View style={styles.welcome}>
          <View>
            <Text center white>
              مرحبا بك
            </Text>
            <View style={{ paddingRight: 5 }}>
              <Text h1 style={{ color: customConstants.fourthColor }}>
                {userProfile.name}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#fff' }}>
          <Text>info</Text>
        </View>
      </View>
      {/* middle */}
      <View style={{ backgroundColor: 'red', flex: 0.7 }}>
        {services === null ? (
          <Text>لا توجد أي خدمات لك حاليا </Text>
        ) : (
          renderServices()
        )}
      </View>
      <View style={{ flex: 0.2 }}>
        <Button
          rounded
          firstIconName='arrowleft'
          style={{ bottom: 100, right: 30 }}
          firstbtnfunction={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: customConstants.PrimaryColor
  },
  top: {
    flex: 0.3,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: customConstants.PrimaryColor,
    width: '80%',
    height: '50%',
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 1
  },
  displayService: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    width: 200,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30
  }
});
export default Profile;
