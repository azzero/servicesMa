import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from './';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as customConstants from '../constants/constants';
import Swipeout from 'react-native-swipeout';
import { f, fr } from '../config/config';
const ProfileService = ({ service, navigation, triggerUpdate }) => {
  // states
  const [activeRowKey, setactiveRowKey] = useState(null);
  const deleteService = () => {
    const { cityName, categoryName } = service.data();
    const serviceId = service.id;
    const response = fr
      .collection('services')
      .doc(cityName)
      .collection(categoryName)
      .doc(serviceId)
      .delete()
      .then(() => console.log('deleted with success '), triggerUpdate())
      .catch(e => {
        alert('وقع خطأ ما !');
        console.log('delete service failed error message  : ', e);
      });
  };
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
      setactiveRowKey(service.data().id);
    },
    right: [
      {
        text: 'حدف',
        backgroundColor: 'red',
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
      }
    ]
  };
  return (
    <TouchableOpacity
      key={service.id}
      // go to addService screen to modify service
      onPress={() =>
        navigation.navigate('AddService', {
          is_update: true,
          serviceData: service.data()
        })
      }
    >
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
    </TouchableOpacity>
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
    borderTopWidth: 1
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
