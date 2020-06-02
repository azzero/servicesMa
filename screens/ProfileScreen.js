import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { f, fr } from '../config/config';
import { Button, Text } from '../components';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  const [services, setServices] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  //render service componenents
  const renderServices = () => {
    const response = services.map(service => {
      return (
        <TouchableOpacity
          key={service.id}
          // go to addService screen to modify service
          onPress={() =>
            navigation.navigate('AddService', { serviceData: service.data() })
          }
        >
          {/*  display service attributs name , phone number , service title , city  */}
          <View style={styles.displayService}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Entypo name='user' size={20} color='#fff' />
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    paddingHorizontal: 6,
                    paddingBottom: 3
                  }}
                >
                  الإسم : {service.data().name}
                </Text>
              </View>
              <View>
                <MaterialCommunityIcons name='worker' size={20} color='#fff' />
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    paddingHorizontal: 6,
                    paddingBottom: 3
                  }}
                >
                  الخدمة:
                  {service.data().CategoryName}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 6
              }}
            >
              <View>
                <Entypo name='phone' size={20} color='#fff' />
              </View>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 6,
                    paddingBottom: 3,
                    color: '#fff'
                  }}
                >
                  الهاتف: {service.data().tele}
                </Text>
              </View>
              <View>
                <Entypo name='location' size={20} color='#fff' />
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    paddingHorizontal: 6,
                    paddingBottom: 3
                  }}
                >
                  المدينة:
                  {service.data().cityName}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
    return <View>{response}</View>;
  };

  //------------------------------------------------//
  //-------------------Use Efeect-------------------//
  //-----------------------------------------------//
  useEffect(() => {
    try {
      // get all user services
      async function getServices() {
        const { uid } = f.auth().currentUser;
        //get all user data by id
        const userDocRef = fr.collection('users').doc(uid);
        const servicesList = await userDocRef.collection('services').get();
        const userInfo = await userDocRef.get();
        const userData = userInfo.data();
        setUserProfile(userData);
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
  if (userProfile === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}> في طور التحميل ... </Text>
      </View>
    );
  }
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
                {userProfile['name']}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#fff' }}>
          <Text>info</Text>
        </View>
      </View>
      {/* middle */}
      <View
        style={{
          backgroundColor: 'red',
          flex: 0.7,
          paddingVertical: 10
        }}
      >
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
    marginHorizontal: 10,
    padding: 5,
    height: 100,
    width: '90%',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20
  }
});
export default Profile;
