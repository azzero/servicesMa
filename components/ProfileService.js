import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileService = ({ service, navigation }) => {
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
};
const styles = StyleSheet.create({
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
export default ProfileService;
