import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { f, fr } from '../config/config';
import { Button, Text, ProfileService } from '../components';
import Constants from 'expo-constants';
import * as customConstants from '../constants/constants';

const Profile = ({ navigation }) => {
  const [services, setServices] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selected, setSelected] = useState(null);

  //------------------------------------------------//
  //-------------------Use Efeect-------------------//
  //-----------------------------------------------//
  useEffect(() => {
    try {
      // get all user services
      async function getServices() {
        const { uid } = f.auth().currentUser;
        console.log('user id : ', uid);
        //get all user data by id
        const userDocRef = fr.collection('users').doc(uid);
        const servicesList = await userDocRef.collection('services').get();
        const userInfo = await userDocRef.get();
        const userData = userInfo.data();
        setUserProfile(userData);
        console.log('length:', servicesList.docs.length);
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
        // everything it's OKay .. dislay profile
       -----------------Top of profile - title -welcome ... ----------------*/}
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
      {/* --------------------middle : display services , informations ..  ------------------*/}
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={services}
            renderItem={({ item }) => (
              <ProfileService service={item} navigation={navigation} />
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
  }
});
export default Profile;
