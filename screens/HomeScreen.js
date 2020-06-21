import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Slider, Platform } from 'react-native';
import UserContext from '../context/UserContext';
import DataContext from '../context/DataContext';
import { Button, Text } from '../components';
import * as CustomConstants from '../constants/constants';
import validate from 'validate.js';
import constraints from '../constants/constraints';
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
  const [displayDistance, setDisplayDistance] = useState(0);
  const [serviceErrors, setServiceerrors] = useState('');
  const [cityErrors, setCityerrors] = useState('');

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
    setCityerrors('');
    setCity(value);
  };
  const setServiceTitleHandler = text => {
    setServiceerrors('');
    setServiceTitle(text);
  };
  const checkButtonHandler = () => {
    if (localisation) {
      setisSearchByPosition(!isSearchByPosition);
    } else {
      navigation.navigate('AskForLocation', { fromScreen: 'Home' });
    }
  };
  //--------------- validation -------------------//
  const checkInputs = () => {
    const validationResult = validate(
      {
        service: serviceTitle,
        city: city,
        tele: '06666666',
        name: 'fakedatatopassvalidation'
      },
      constraints.services
    );
    if (typeof validationResult !== 'undefined' && validationResult.service) {
      const error2 = validationResult.service[0];
      setServiceerrors(error2);
    }
    if (typeof validationResult !== 'undefined' && validationResult.city) {
      const error4 = validationResult.city[0];
      setCityerrors(error4);
    }
    console.log('validation result : ', validationResult);
    if (typeof validationResult === 'undefined') {
      console.log('everyhing is okay');
      getdata();
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
  //-------------------Go To Profile  function-------------//
  const GoToProfile = () => {
    navigation.navigate('Profile');
  };
  // ------------------ADD Service function ----------------------//
  const goToAddService = () => {
    navigation.navigate('AddService', { is_update: false });
  };
  //-------------- make search function ------------------------------>
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

      if (isSearchByPosition) {
        console.log('inside true ');
        const center = geo.point(localisation.latitude, localisation.longitude);
        const radius = distance;
        const field = 'location';
        const query = geo.query(services).within(center, radius, field);
        const docs = await get(query);
        setData(docs);
        if (!docs.length) {
          alert(' لا توجد أي خدمات موافقة للمعطيات التي أدخلت ');
          return;
        }
      } else {
        const response = await fr
          .collection('services')
          .doc(city)
          .collection(serviceTitle)
          .get();
        setData(response.docs);
        if (!response.docs.length) {
          alert(' لا توجد أي خدمات موافقة للمعطيات التي أدخلت ');
          return;
        }
      }

      console.log('searching by inside home : ', isSearchByPosition);
      navigation.navigate('DisplayServices', {
        distance: distance,
        searchingByPosition: isSearchByPosition,
        service: serviceTitle,
        city
      });
    } catch (e) {
      console.log(e);
    }
  };
  //------------------------------------------------//
  //------------------------use effect------------------//
  //-----------------------------------------------//
  useEffect(() => {
    if (asklocalisationpopup && localisation === null) {
      console.log('inside use effect ');
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
          <View
            style={{
              borderBottomWidth: 1,
              borderRadius: 20,
              borderBottomColor: customConstants.fourthColor,
              width: '70%',
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
              إبحث عن خدمة
            </Text>
          </View>
          {/* <Text>
            {localisation &&
              `your localisation is longitude : ${localisation.longitude} latitude : ${localisation.latitude} `}
          </Text> */}
          <Dropdown
            error={serviceErrors}
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
            error={cityErrors}
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
            checkedColor={customConstants.fourthColor}
            onPress={() => checkButtonHandler()}
            title=' البحث من خلال موقعك غير مفعل '
            checkedTitle='البحث انطلاقا من موقعك مفعل '
            checked={isSearchByPosition}
          />
          {isSearchByPosition === false ? null : (
            <View style={{ paddingLeft: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <View>
                  <MaterialCommunityIcons
                    size={20}
                    color={customConstants.fourthColor}
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
                  style={{ borderRadius: 10, height: 20 }}
                  onSlidingComplete={value => setDistance(value)}
                  step={20}
                  minimumValue={0}
                  maximumValue={5000}
                  thumbTintColor={customConstants.fourthColor}
                  value={distance}
                  onValueChange={value => setDisplayDistance(value)}
                  // animateTransitions={true}
                />
              </View>
            </View>
          )}
          <View style={{ marginTop: 30 }}>
            <Button gradient onPress={() => checkInputs()}>
              <Text button>إبحث</Text>
            </Button>
          </View>
        </View>
      </View>

      {/*------------BOTTOM -------------------- */}
      <View style={styles.buttonContainer}>
        <Button
          multiple
          firstIconName='plus'
          lastIconName='logout'
          secondIconName='profile'
          rounded
          style={{ bottom: 30 }}
          lastbtnfunction={() => logout()}
          secondbtnfunction={() => GoToProfile()}
          firstbtnfunction={() => goToAddService()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomConstants.PrimaryColor,
    justifyContent: 'center'
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
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center'
  },
  form: {
    marginVertical: 10,
    width: '90%'
  },
  roundedButton: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    height: 60,
    width: 60,
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: customConstants.fourthColor
  }
});
export default Home;
