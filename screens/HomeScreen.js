import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Slider, Platform } from 'react-native';
import UserContext from '../context/UserContext';
import DataContext from '../context/DataContext';
import { Button, Text } from '../components';
import * as CustomConstants from '../constants/constants';
import { auth, fr, geo } from '../config/config';
import LocalisationContext from '../context/LocalisationContext';
import * as customConstants from '../constants/constants';
import { get } from 'geofirex';
import { Dropdown } from 'react-native-material-dropdown';
import { CheckBox } from 'react-native-elements';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//-------------- Home Screen ---------------------//
const Home = props => {
  //------------------------------------------------//
  //------------------------State-------------------//
  //-----------------------------------------------//
  const [serviceTitle, setServiceTitle] = useState('');
  const [city, setCity] = useState('');
  const [isSearchByPosition, setisSearchByPosition] = useState(false);
  const [distance, setDistance] = useState(0);
  const [displayDistance, setDispayDistance] = useState(0);
  //------------------------------------------------//
  //----------------------Context------------------//
  //-----------------------------------------------//
  const { navigation } = props;
  const { data, setData } = useContext(DataContext);
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  // const [data, setData] = useState(null);
  const { logging, tokenManager } = useContext(UserContext);
  const { isLoggedIn, setisLoggedIn } = logging;
  const { asklocalisationpopup, setasklocalisationpopup } = askingPosition;
  //------------------------------------------------//
  //---------------------Handlers-------------------//
  //-----------------------------------------------//
  const citiesPickerHandler = value => {
    setCity(value);
  };
  const setServiceTitleHandler = text => {
    setServiceTitle(text);
  };
  const checkButtonHandler = () => {
    if (localisation) {
      setisSearchByPosition(!isSearchByPosition);
    } else {
      navigation.navigate('AskForLocation');
    }
  };
  //----------- logout funcion ------------------//
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        setisLoggedIn(false);
      })
      .catch(error => {
        console.log('eror', error);
      });
  };

  const getdata = async () => {
    try {
      const services = fr
        .collection('services')
        .doc(city)
        .collection(serviceTitle);
      // const center = geo.point(localisation.latitude, localisation.longitude);
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setlocalisation({ latitude: 32.26114, longitude: -9.24752 });
      }
      const center = geo.point(localisation.latitude, localisation.longitude);
      const radius = distance;
      const field = 'location';
      const query = geo.query(services).within(center, radius, field);
      const docs = await get(query);
      setData(docs);
      navigation.navigate('DisplayServices', { distance: distance });
    } catch (e) {
      console.log(e);
    }
  };
  //------------------------------------------------//
  //------------------------use effect------------------//
  //-----------------------------------------------//
  useEffect(() => {
    if (asklocalisationpopup && localisation === null) {
      setisSearchByPosition(false);
      alert('للأسف تعدر علينا الوصول لموقعك');
    }
    if (asklocalisationpopup && localisation !== null) {
      console.log('localisation updated', localisation);
      setisSearchByPosition(true);
    }
  }, [asklocalisationpopup, localisation]);
  //----------------------------------------
  return (
    <View style={styles.container}>
      {/*------------------Top------------------- */}
      <View style={styles.top}>
        <View style={styles.form}>
          {/* <Text>
            {localisation &&
              `your localisation is longitude : ${localisation.longitude} latitude : ${localisation.latitude} `}
          </Text> */}
          <Dropdown
            label='نوع الخدمة'
            dropdownOffset={{ top: 20, left: 0 }}
            data={customConstants.services}
            baseColor='#ffffff'
            itemColor='#ffffff'
            textColor={customConstants.fourthColor}
            containerStyle={{
              paddingLeft: 10
            }}
            onChangeText={value => {
              setServiceTitleHandler(value);
            }}
            pickerStyle={{
              borderRadius: 15,
              backgroundColor: customConstants.PrimaryColor,
              borderColor: customConstants.fourthColor,
              borderWidth: 1
            }}
            itemTextStyle={{
              fontFamily: customConstants.ShebaYeFont,
              textAlign: 'center',
              margin: 1
            }}
            rippleInsets={{ top: 20, bottom: 10 }}
            itemCount={8}
            value={serviceTitle}
            rippleCentered={true}
          />
          <Dropdown
            label='المدينة'
            data={customConstants.MoroccoCities}
            baseColor='#ffffff'
            itemColor='#ffffff'
            textColor={customConstants.fourthColor}
            containerStyle={{
              paddingLeft: 10
            }}
            dropdownOffset={{ top: 20, left: 0 }}
            onChangeText={value => {
              citiesPickerHandler(value);
            }}
            pickerStyle={{
              borderRadius: 15,
              backgroundColor: customConstants.PrimaryColor,
              borderColor: customConstants.fourthColor,
              borderWidth: 1
            }}
            itemTextStyle={{
              fontFamily: customConstants.ShebaYeFont,
              textAlign: 'center',
              margin: 1
            }}
            rippleInsets={{ top: 16, bottom: 6 }}
            itemCount={7}
            value={city}
            rippleCentered={true}
          />
          <CheckBox
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            containerStyle={{ backgroundColor: customConstants.PrimaryColor }}
            textStyle={{ color: '#ffffff' }}
            uncheckedColor='#ff0000'
            checkedColor='#00ff00'
            onPress={() => checkButtonHandler()}
            title=' البحث عبر موقعك الحالي'
            checked={isSearchByPosition}
          />
          {isSearchByPosition === false ? null : (
            <View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  marginVertical: 15,
                  width: '100%'
                }}
              >
                <Slider
                  style={{ flexDirection: 'row' }}
                  onSlidingComplete={value => setDistance(value)}
                  step={20}
                  minimumValue={0}
                  maximumValue={5000}
                  thumbTintColor={customConstants.fourthColor}
                  value={distance}
                  onValueChange={value => setDispayDistance(value)}
                  // animateTransitions={true}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <MaterialCommunityIcons
                    size={20}
                    color='#ffffff'
                    name='map-marker-distance'
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: customConstants.ShebaYeFont,
                      color: '#ffffff',
                      paddingHorizontal: 6,
                      paddingBottom: 3
                    }}
                  >
                    أقصى مسافة يبعد عنك مقدم الخدمة :
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: customConstants.fourthColor,
                      fontFamily: customConstants.PrimaryFont,
                      paddingHorizontal: 3,
                      paddingBottom: 5
                    }}
                  >
                    {displayDistance} متر
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View style={{ marginTop: 20 }}>
            <Button gradient onPress={() => getdata()}>
              <Text button>إبحث</Text>
            </Button>
          </View>
        </View>
      </View>

      {/*------------BOTTOM -------------------- */}
      <View style={styles.buttonContainer}>
        {/* <Button gradient onPress={() => navigation.navigate('AddService')}>
          <Text button> أضف خدمة </Text>
        </Button>
        <View>
          <Button roinded onPress={() => logout()}>
            <Text button> logout </Text>
          </Button>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomConstants.PrimaryColor
  },
  top: {
    flex: 1,
    // borderColor: 'blue',
    // borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 0.4,
    alignSelf: 'center',
    marginVertical: 10,
    bottom: 0,
    width: '80%'
  },
  form: {
    marginVertical: 10,
    width: '90%'
  }
});
export default Home;
