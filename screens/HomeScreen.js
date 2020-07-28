import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Slider, Platform, Alert } from 'react-native';
import UserContext from '../context/UserContext';
import DataContext from '../context/DataContext';
import { Button, Text } from '../components';
import * as CustomConstants from '../constants/constants';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { auth, fr, geo, f } from '../config/config';
import LocalisationContext from '../context/LocalisationContext';
import * as customConstants from '../constants/constants';
import { get } from 'geofirex';
import { Dropdown } from 'react-native-material-dropdown';
import { CheckBox } from 'react-native-elements';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import { bannerAdsIDs } from '../constants/AdsParams';
import LoadingDots from 'react-native-loading-dots';
console.disableYellowBox = true;
// global :
const bannerAdId =
  Platform.OS === 'ios' ? bannerAdsIDs.iosreal : bannerAdsIDs.androidreal;

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
  const [isloading, setIsloading] = useState(false);

  //------------------------------------------------//
  //------------------------ads params------------------//
  //-----------------------------------------------//
  const bannerError = e => {
    console.log('banner error : ', e);
  };
  //------------------------------------------------//
  //------------------------Ref--------------------//
  //-----------------------------------------------//
  const MenuRef = useRef(null);
  //------------------------------------------------//
  //----------------------Context------------------//
  //-----------------------------------------------//
  const { navigation } = props;
  const { data, setData } = useContext(DataContext);
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  const { tokenManager, servicesManager } = useContext(UserContext);
  const { services, setServices } = servicesManager;
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
        tele: '0666666666',
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
        console.log('signout');
      })
      .catch(error => {
        console.log('eror', error);
      });
  };
  //-------------------Go To Profile  function-------------//
  const GoToProfile = () => {
    MenuRef.current.toggleMenu();
    navigation.navigate('Profile');
  };
  // ------------------ADD Service function ----------------------//
  const goToAddService = () => {
    // if the user already create 3 services , so he hit the limit
    if (services !== null && services.length >= 3) {
      Alert.alert(
        'للأسف',
        ' لقد وصلت للحد الأقصى المسموح به و هو 3 خدمات للشخص الواحد ، إذهب لملفك الشخصي وقم بحدف أو التعديل على إحدى خدماتك ',
        [
          {
            text: 'الرجوع',
            onPress: () => console.log('cancel'),
            style: 'cancel'
          },
          {
            text: 'الملف الشخصي',
            onPress: () => navigation.navigate('Profile')
          }
        ],
        { cancelable: true }
      );
      return;
    }
    // else go to add service
    MenuRef.current.toggleMenu();
    navigation.navigate('AddService', { is_update: false });
  };
  //-------------- make search function ------------------------------>
  const getdata = async () => {
    try {
      const category = fr
        .collection('services')
        .doc(city)
        .collection(serviceTitle);
      // const center = geo.point(localisation.latitude, localisation.longitude);
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setlocalisation({ latitude: 0, longitude: 0 });
      }

      if (isSearchByPosition) {
        console.log('inside true ');
        const center = geo.point(localisation.latitude, localisation.longitude);
        const radius = distance;
        const field = 'location';
        setIsloading(true);
        const query = geo.query(category).within(center, radius, field);
        const docs = await get(query);
        setIsloading(false);
        setData(docs);
        if (!docs.length) {
          alert(
            ' لا توجد حاليا أي خدمات موافقة للمعطيات التي أدخلت ، المرجو معاودة المحاولة لاحقا أو توسيع دائرة البحث عن طريق زيادة المسافة   '
          );
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
          alert(
            ' لا توجد حاليا أي خدمات موافقة للمعطيات التي أدخلت ، المرجو معاودة المحاولة لاحقا '
          );
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
  //--------------------use effect-----------------//
  //-----------------------------------------------//
  useEffect(() => {
    console.log('services in home screen : ', services);
    if (asklocalisationpopup && localisation === null) {
      console.log('inside use effect ');
      setisSearchByPosition(false);
      Alert.alert(
        'للأسف',
        ' تعدر علينا الوصول لموقعك ',
        [
          {
            text: 'الرجوع',
            onPress: () => console.log('cancel'),
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }
    if (asklocalisationpopup && localisation !== null) {
      console.log('localisation updated', localisation);
      setisSearchByPosition(true);
    }

    const FocusListener = navigation.addListener('blur', () => {
      // MenuRef.current.toggleMenu();
      MenuRef.current.open = false;
    });
    return FocusListener;
  }, [asklocalisationpopup, localisation]);
  //----------------------------------------
  //while waiting for  data
  if (isloading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <LoadingDots />
        <View style={{ marginTop: 20 }}>
          <Text
            style={{ fontSize: 20, fontFamily: customConstants.ShebaYeFont }}
          >
            جاري البحث ..
          </Text>
        </View>
      </View>
    );
  }
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
          <Dropdown
            dropdownPosition={-5}
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
              borderWidth: 1,
              marginTop: Constants.statusBarHeight + 20
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
          <View style={{ marginVertical: 30 }}>
            <Button gradient onPress={() => checkInputs()}>
              <Text button>إبحث</Text>
            </Button>
          </View>
        </View>
      </View>

      {/*------------BOTTOM -------------------- */}
      <View style={styles.buttonContainer}>
        <Button
          ref={MenuRef}
          multiple
          firstIconName='plus'
          lastIconName='logout'
          secondIconName='profile'
          rounded
          style={{ bottom: 0 }}
          lastbtnfunction={() => logout()}
          secondbtnfunction={() => GoToProfile()}
          firstbtnfunction={() => goToAddService()}
          // initialise={isMenuNeedToBeClosed}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
          // borderWidth: 2,
          // borderColor: 'red',
          flex: 0.2
        }}
      >
        <AdMobBanner bannerSize='banner' adUnitID={bannerAdId} />
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
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: 'center'
    // justifyContent: 'center'
  },
  buttonContainer: {
    flex: 0.2,
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
