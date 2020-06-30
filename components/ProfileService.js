import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from './';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
import Swipeout from 'react-native-swipeout';
import { f, fr } from '../config/config';
import SwipeOutButton from '../components/SwipeOutButton';
const ProfileService = ({ service, navigation, triggerUpdate }) => {
  // states
  const [activeRowKey, setactiveRowKey] = useState(null);
  const { cityName, categoryName } = service.data();
  const serviceId = service.id;
  const currentUser = f.auth().currentUser;
  // -----------delete service from Profile -------------------------------------------->
  const deleteServiceFromProfile = () => {
    fr.collection('users')
      .doc(currentUser.uid)
      .collection('services')
      .doc(serviceId)
      .delete()
      .then(() => console.log('deleted service form profile  successfully '))
      .catch(e => {
        console.log('delete service failed error message  : ', e);
      });
  };
  // -----------delete service function -------------------------------------------->
  const deleteService = () => {
    const response = fr
      .collection('services')
      .doc(cityName)
      .collection(categoryName)
      .doc(serviceId)
      .delete()
      .then(
        () => console.log('deleted with success '),
        deleteServiceFromProfile(),
        triggerUpdate(activeRowKey)
      )
      .catch(e => {
        alert('وقع خطأ ما !');
        console.log('delete service failed error message  : ', e);
      });
  };
  //----------------------------------------------------------------------->
  var swipeoutsettings = {
    //swipeout component settings
    backgroundColor: customConstants.PrimaryColor,
    autoClose: true,
    onClose: (secId, rowId, direction) => {
      if (activeRowKey !== null) {
        setactiveRowKey(null);
      }
    },
    onOpen: (secId, rowId, direction) => {
      setactiveRowKey(service.id);
    },
    right: [
      {
        text: 'حدف',
        backgroundColor: customConstants.PrimaryColor,
        component: <SwipeOutButton color='red' name='cross' text='حدف' />,
        type: 'delete',
        onPress: () => {
          Alert.alert(
            'Alert',
            'هل أنت متأكد من أنك تريد حدف  هذه الخدمة ؟ ',
            [
              {
                text: 'لا',
                onPress: () => console.log('cancel pressed'),
                style: 'cancel'
              },
              {
                text: 'نعم',
                onPress: () => {
                  deleteService();
                }
              }
            ],
            { cancelable: true }
          );
        }
      },
      {
        text: 'تعديل',
        backgroundColor: customConstants.PrimaryColor,
        component: <SwipeOutButton color='#00ff00' name='edit' text='تعديل' />,
        onPress: () => {
          navigation.navigate('AddService', {
            is_update: true,
            serviceData: service.data(),
            id: service.id
          });
        }
      }
    ]
  };
  //------------------------------------------------//
  //------------------------render-----------------//
  //-----------------------------------------------//
  return (
    <View>
      <Swipeout {...swipeoutsettings}>
        {/*  display service attributs name , phone number , service title , city  */}
        <View style={styles.displayService}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.entity}>
              <View>
                <Entypo
                  name='user'
                  size={20}
                  color={customConstants.fourthColor}
                />
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
            </View>
            {/* end name entity  */}
            <View style={styles.entity}>
              <View>
                <MaterialCommunityIcons
                  name='worker'
                  size={20}
                  color={customConstants.fourthColor}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    paddingHorizontal: 6,
                    paddingBottom: 3
                  }}
                >
                  الخدمة:{service.data().categoryName}
                </Text>
              </View>
            </View>
            {/* end of service entity */}
          </View>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <View style={styles.entity}>
              <View>
                <Entypo
                  name='phone'
                  size={20}
                  color={customConstants.fourthColor}
                />
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
            </View>
            {/* end of phone entity */}
            <View style={styles.entity}>
              <View>
                <Entypo
                  name='location'
                  size={20}
                  color={customConstants.fourthColor}
                />
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
        </View>
      </Swipeout>
    </View>
  );
};
const styles = StyleSheet.create({
  displayService: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
    // marginTop: 10,
    padding: 5,
    height: 100,
    width: '100%',
    borderColor: '#fff',
    borderBottomWidth: 1
    // borderRadius: 20
  },
  entity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.5
    // borderWidth: 1,
    // borderColor: 'red'
  }
});
export default ProfileService;
