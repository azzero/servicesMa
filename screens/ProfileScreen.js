import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { f, fr } from '../config/config';
import { Button, Text, ProfileService } from '../components';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';
import { Entypo } from '@expo/vector-icons';

const Profile = ({ route, navigation }) => {
  const [services, setServices] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [is_needUpdate, setIs_needUpdate] = useState(false);
  // var force_update = null;
  // force_update = route.params && route.params.force_update;
  // if (force_update) {
  //   setServices(null);
  // }
  //------------------------------------------------//
  //----------------------functions----------------//
  //-----------------------------------------------//

  const handleTriggerUpdate = id => {
    setIs_needUpdate(!is_needUpdate);
    let new_list = null;
    new_list = services.filter(service => {
      return service.id !== id;
    });
    setServices(new_list);
    console.log('handle trigger update ', new_list);
  };
  //------------------------------------------------//
  //-------------------Use Efeect-------------------//
  //-----------------------------------------------//
  useEffect(() => {
    try {
      // get all user services
      async function getServices() {
        console.group('inside get services function ');
        const { uid } = f.auth().currentUser;
        //get all user data by id
        const userDocRef = fr.collection('users').doc(uid);
        const servicesList = await userDocRef.collection('services').get();
        const userInfo = await userDocRef.get();
        const userData = userInfo.data();
        setUserProfile(userData);

        // get services from docs
        if (servicesList.docs.length) {
          setServices(servicesList.docs);
        } else {
          console.log('document doesnt exist ');
        }
      }
      getServices();
      // add listener to screen focus
      const unsubscribe = navigation.addListener('focus', () => {
        getServices();
      });
      return unsubscribe;
    } catch (e) {
      console.log('error : ', e);
    }
    console.log('rendering ');
  }, []);

  //------------------------------------------------//
  //-----------------------Render------------------//
  //-----------------------------------------------//
  console.log('user profile data : ', userProfile);
  if (userProfile === null) {
    // loading ...
    return (
      <View
        style={{
          ...styles.container,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* <Text style={{ color: 'white' }}> في طور التحميل ... </Text> */}
        <ActivityIndicator size='large' color={customConstants.fourthColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/*
         everything it's OKay .. dislay profile
          Top of profile - title - welcome 
      */}
      <View style={styles.top}>
        <View style={styles.welcome}>
          <View style={{ position: 'absolute', left: 5, top: 5 }}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Entypo name='edit' size={22} color='#fff' />
            </TouchableWithoutFeedback>
          </View>
          <View>
            <Text center white>
              مرحبا بك
            </Text>
            <View style={{ paddingRight: 5 }}>
              <Text h1 style={{ color: customConstants.fourthColor }} center>
                {userProfile ? userProfile['name'] : 'في ملفك الشخصي'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* --------------------middle : display services , informations ..  ------------------*/}
      <View
        style={{
          flex: 0.7,
          paddingVertical: 10
        }}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderRadius: 20,
            borderBottomColor: customConstants.fourthColor,
            width: '50%',
            marginBottom: 20
          }}
        >
          <Text
            h1
            right
            style={{
              color: customConstants.fourthColor,
              paddingHorizontal: 20
            }}
          >
            خدماتك :
          </Text>
        </View>
        {services === null || services.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>لا توجد أي خدمات لك حاليا </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={services}
            renderItem={({ item }) => (
              <ProfileService
                service={item}
                navigation={navigation}
                triggerUpdate={handleTriggerUpdate}
              />
            )}
            keyExtractor={item => item.id}
            extraData={selected}
          />
        )}
      </View>
      <View style={{ flex: 0.2 }}>
        <Button
          rounded
          firstIconName='arrowleft'
          style={{ bottom: 35, right: 45 }}
          firstbtnfunction={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};
//------------------------------------------------//
//------------------------Styling----------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: customConstants.PrimaryColor
  },
  top: {
    flex: 0.3,
    backgroundColor: customConstants.PrimaryColor,
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
  }
});
export default Profile;
