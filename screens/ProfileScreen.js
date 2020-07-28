import React, { useEffect, useState, useContext } from 'react';
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
import { AntDesign } from '@expo/vector-icons';
import { AdMobBanner } from 'expo-ads-admob';
import UserContext from '../context/UserContext';
import { bannerAdsIDs } from '../constants/AdsParams';
// global :
const bannerAdId =
  Platform.OS === 'ios' ? bannerAdsIDs.iosreal : bannerAdsIDs.androidreal;
const Profile = ({ route, navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [is_needUpdate, setIs_needUpdate] = useState(false);

  //------------------------------------------------//
  //------------------------context------------------//
  //-----------------------------------------------//
  const { servicesManager } = useContext(UserContext);
  const { services, setServices } = servicesManager;
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
      console.log('services in home screen : ', services);
      // get all user services
      async function getUserInfo() {
        console.group('inside get services function ');
        const { uid } = f.auth().currentUser;
        //get all user data by id
        const userDocRef = fr.collection('users').doc(uid);
        const userInfo = await userDocRef.get();
        const userData = userInfo.data();
        setUserProfile(userData);
      }
      getUserInfo();
      // add listener to screen focus
      const unsubscribe = navigation.addListener('focus', () => {
        getUserInfo();
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

      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('EditProfile')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.welcome}>
          <View
            style={{
              position: 'absolute',
              left: 5,
              top: 5,
              // borderWidth: 2,
              // borderColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              height: 30
            }}
          >
            <View>
              <AntDesign name='setting' size={22} color='#fff' />
            </View>
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
      </TouchableWithoutFeedback>

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
      <View style={{ flex: 0.1 }}>
        <Button
          rounded
          firstIconName='arrowleft'
          style={{ bottom: 40, right: 40 }}
          firstbtnfunction={() => navigation.goBack()}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 200,
          alignItems: 'center',
          flex: 0.1
        }}
      >
        <AdMobBanner bannerSize='banner' adUnitID={bannerAdId} />
      </View>
    </View>
  );
};
//------------------------------------------------//
//------------------------Styling----------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: customConstants.PrimaryColor
  },
  welcome: {
    flex: 0.2,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: customConstants.PrimaryColor,
    width: '80%',
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 1
  }
});
export default Profile;
