import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Text, Input, Button } from '../components';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { f, fr, geo, auth } from '../config/config';
import { Dropdown } from 'react-native-material-dropdown';
import * as customConstants from '../constants/constants';
import LocalisationContext from '../context/LocalisationContext';
import { CheckBox } from 'react-native-elements';
import Constants from 'expo-constants';

var is_update = false;
const Service = ({ route, navigation }) => {
  //---------------Some params ---------------------------//
  const currentUser = f.auth().currentUser;
  //----------------State --------------------------------//
  const [name, setName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [tele, setTele] = useState('');
  const [Description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [serviceID, setserviceID] = useState(null);
  const [isSearchByPosition, setisSearchByPosition] = useState(false);
  const [originalService, setOriginalService] = useState(null);
  const [originalCity, setOriginalCity] = useState(null);
  const [nameErrors, setNameerrors] = useState('');
  const [serviceErrors, setServiceerrors] = useState('');
  const [teleErrors, setTeleerrors] = useState('');
  const [cityErrors, setCityerrors] = useState('');
  const [DescriptionErrors, setDescriptionErrors] = useState('');
  //------------------------------------------------//
  //-----------------------Context ----------------//
  //-----------------------------------------------//
  const { position, askingPosition } = useContext(LocalisationContext);
  const { asklocalisationpopup, setasklocalisationpopup } = askingPosition;
  const { localisation, setlocalisation } = position;
  //------------------ REFERENCES --------------------------//
  const nameRef = React.createRef();
  // const serviceRef = React.createRef();
  const teleRref = React.createRef();
  const DescriptionRref = React.createRef();

  //------------------------------------------------//
  //-----------------------functions----------------//
  //-----------------------------------------------//
  // logout
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
  // add service to user profile
  const addServiceToProfile = id => {
    console.log('inside addThisServiceToProfile ', id);
    fr.collection('users')
      .doc(currentUser.uid)
      .collection('services')
      .doc(id)
      .set({
        categoryName: serviceTitle,
        cityName: city,
        name,
        tele
      })

      .then(() => console.log('service add to profile successfully '))
      .catch(e => console.log('error when add service to profile :', e));
  };
  // update service in user profile
  const updateServiceInProfile = serviceId => {
    fr.collection('users')
      .doc(currentUser.uid)
      .collection('services')
      .doc(serviceId)
      .update({
        categoryName: serviceTitle,
        cityName: city,
        name,
        tele
      })
      .then(
        () => console.log('service updated in profile successfully '),
        Alert.alert(
          'ممتاز !!',
          'تمت تعديل بنجاح   ',
          [
            {
              text: 'البقاء هنا ',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'الرجوع لملفك الشخصي ',
              onPress: () =>
                navigation.navigate('Profile', { force_update: true })
            }
          ],
          { cancelable: false }
        )
      )
      .catch(e => console.log('error when update service to profile :', e));
  };
  // delete service from user profile

  const deleteServiceFromProfile = serviceId => {
    fr.collection('users')
      .doc(currentUser.uid)
      .collection('services')
      .doc(serviceId)
      .delete()
      .then(() => console.log('service deleted from user profile '))
      .catch(e =>
        console.log('error when deleting  service from profile :', e)
      );
  };
  // goTo Profile
  const GoToProfile = () => {
    navigation.navigate('Profile');
  };

  //------------------SetState Handler --------------------//

  const checkButtonHandler = () => {
    if (localisation) {
      setisSearchByPosition(!isSearchByPosition);
    } else {
      navigation.navigate('AskForLocation', { fromScreen: 'AddService' });
    }
  };
  const setNameHandler = text => {
    setNameerrors('');
    setName(text);
  };
  const setServiceTitleHandler = text => {
    setServiceerrors('');
    setServiceTitle(text);
  };
  const setTeleHandler = text => {
    setTeleerrors('');
    setTele(text);
  };
  const setDescriptionHandler = text => {
    setDescriptionErrors('');
    setDescription(text);
  };
  const citiesPickerHandler = value => {
    setCityerrors('');
    setCity(value);
  };

  //------------------------------------------------//
  //------------------validation and insertion------------------//
  //-----------------------------------------------//
  const confirm = async () => {
    try {
      const validationResult = validate(
        { name: name, service: serviceTitle, tele: tele, city: city },
        constraints.services
      );
      if (typeof validationResult !== 'undefined' && validationResult.name) {
        const error1 = validationResult.name[0];
        setNameerrors(error1);
        nameRef.current.shake();
      }
      if (typeof validationResult !== 'undefined' && validationResult.service) {
        const error2 = validationResult.service[0];
        setServiceerrors(error2);
        // serviceRef.current.shake();
      }
      if (typeof validationResult !== 'undefined' && validationResult.tele) {
        const error3 = validationResult.tele[0];
        setTeleerrors(error3);
        teleRref.current.shake();
      }
      if (typeof validationResult !== 'undefined' && validationResult.city) {
        const error4 = validationResult.city[0];
        setCityerrors(error4);
      }
      if (typeof validationResult === 'undefined') {
        // if everything is okay and pass validation
        let position = null;
        if (isSearchByPosition) {
          position = geo.point(localisation.latitude, localisation.longitude);
        } else {
          position = geo.point(0, 0);
        }
        // if it's and update  and the use didnt change city or service category we update the same document
        if (
          is_update &&
          originalCity === city &&
          originalService === serviceTitle
        ) {
          const serviceDocRef = fr
            .collection('services')
            .doc(city)
            .collection(serviceTitle)
            .doc(serviceID);
          const response = await serviceDocRef.update({
            name: name,
            Description: Description,
            tele: tele,
            location: position,
            userID: currentUser.uid
          });
          updateServiceInProfile(serviceID);
        } else {
          // if it's an update and the user change city or service category we need to delete the first record and create new one to respect db modeling
          if (is_update) {
            fr.collection('services')
              .doc(originalCity)
              .collection(originalService)
              .doc(serviceID)
              .delete()
              .then(
                () => console.log('deleted with success '),
                deleteServiceFromProfile(serviceID)
              )
              .catch(e => {
                console.log('error : ', e);
                alert('وقع خطأ ما ، الرجاء إعادة المحاولة ');
              });
          }
          fr.collection('services')
            .doc(city)
            .collection(serviceTitle)
            .add({
              name: name,
              Description: Description,
              tele: tele,
              location: position,
              userID: currentUser.uid
            })
            .then(function(response) {
              addServiceToProfile(response.id);
              Alert.alert(
                'ممتاز !!',
                'تمت الإضافة بنجاح ',
                [
                  {
                    text: 'البقاء هنا ',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                  },
                  {
                    text: 'الرجوع للواجهة الرئيسية',
                    onPress: () => navigation.navigate('Home')
                  }
                ],
                { cancelable: false }
              );
            })
            .catch(function(error) {
              alert('وقع خطأ ما ، المرجو إعادة المحاولة');
              console.error('Error writing document: ', error);
            });
        }
      }
    } catch (e) {
      console.log('error : ', e);
      alert('وقع خطأ ما  ، المرجو اعادة المحاولة  ');
    }
  };
  //------------------------------------------------//
  //---------------------Use Effect-----------------//
  //-----------------------------------------------//
  useEffect(() => {
    try {
      async function getService() {
        is_update = route.params.is_update;
        if (is_update) {
          // if it's comming for an update
          const { serviceData, id } = route.params;
          const { cityName, categoryName, name, tele } = serviceData;
          const serviceId = id;
          const serviceDocRef = fr
            .collection('services')
            .doc(cityName)
            .collection(categoryName)
            .doc(serviceId);
          const service = await serviceDocRef.get();
          // if it's update get data and set all values
          if (
            typeof serviceData !== 'undefined' &&
            typeof service !== 'undefined'
          ) {
            const { Description, location } = service.data();
            setCity(cityName);
            setOriginalCity(cityName);
            setName(name);
            setTele(tele);
            setDescription(Description);
            setserviceID(serviceId);
            setServiceTitle(categoryName);
            setOriginalService(categoryName);
            if (location.geohash !== '7zzzzzzzz') {
              setisSearchByPosition(true);
              console.log('geo point :', location.geopoint);
              setlocalisation(location.geopoint);
            }
          }
        } else {
          // if it's an creation of new service put user info as default values
          console.log('add service party ');
          const { uid } = f.auth().currentUser;
          const userDocRef = fr.collection('users').doc(uid);
          const userInfo = await userDocRef.get();
          const userData = userInfo.data();
          console.log(' userinfo : ', userData);
          if (typeof userData !== 'undefined') {
            setCity(userData.city);
            setName(userData.name);
            setServiceTitle(userData.service);
            setTele(userData.tele);
          }
        }
      }

      getService();
    } catch (e) {
      alert('حدث خطأ ما ');
      console.log('error : ', e);
    }
  }, []);
  useEffect(() => {
    if (asklocalisationpopup && localisation === null) {
      setisSearchByPosition(false);
      // alert('للأسف تعدر علينا الوصول لموقعك');
    }
    if (asklocalisationpopup && localisation !== null) {
      console.log('localisation updated', localisation);
      setisSearchByPosition(true);
    }
  }, [asklocalisationpopup, localisation]);
  //------------------------------------------------//
  //-----------------------Render------------------//
  //-----------------------------------------------//
  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffse={30}
    //   enabled
    //   style={{ flex: 1 }}
    // >
    <View style={styles.container}>
      <View style={styles.form}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: customConstants.fourthColor,
            marginBottom: 20,
            width: '50%',
            borderRadius: 20
          }}
        >
          <Text
            style={{
              color: customConstants.fourthColor,
              paddingHorizontal: 20
            }}
            h1
            right
          >
            {is_update ? ' تعديل خدمة' : ' أضف خدمة'}
          </Text>
        </View>
        <Input
          ref={nameRef}
          inputHandler={setNameHandler}
          errorMessage={nameErrors}
          placeholder='الاسم'
          value={name}
          autoCorrect={false}
          maxLength={60}
        />

        <Dropdown
          label='نوع الخدمة'
          baseColor='#ffffff'
          itemColor='#ffffff'
          textColor={customConstants.fourthColor}
          dropdownOffset={{ top: 20, left: 0 }}
          rippleInsets={{ top: 20, bottom: 0 }}
          data={customConstants.services}
          containerStyle={{
            justifyContent: 'center',
            width: '100%',
            paddingHorizontal: 10
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
          itemCount={8}
          value={serviceTitle}
          rippleCentered={true}
          error={serviceErrors}
        />
        <Input
          ref={DescriptionRref}
          errorMessage={DescriptionErrors}
          inputHandler={setDescriptionHandler}
          multiline={true}
          autoCorrect={false}
          numberOflines={4}
          placeholder='وصف الخدمة'
          value={Description}
          maxLength={150}
        />
        <Input
          ref={teleRref}
          errorMessage={teleErrors}
          inputHandler={setTeleHandler}
          placeholder='رقم الهاتف'
          value={tele}
          autoCorrect={false}
        />

        <Dropdown
          label='المدينة'
          baseColor='#ffffff'
          itemColor='#ffffff'
          textColor={customConstants.fourthColor}
          data={customConstants.MoroccoCities}
          containerStyle={{
            justifyContent: 'center',
            width: '100%',
            paddingHorizontal: 10
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
          rippleInsets={{ top: 0, bottom: 0 }}
          itemCount={7}
          value={city}
          rippleCentered={true}
          error={cityErrors}
        />

        <CheckBox
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          containerStyle={{
            backgroundColor: customConstants.PrimaryColor
          }}
          textStyle={{ color: '#ffffff' }}
          uncheckedColor='#ff0000'
          checkedColor={customConstants.fourthColor}
          onPress={() => checkButtonHandler()}
          title=' موقعك ليس مربوط بالخدمة '
          checkedTitle='موقعك مربوط بالخدمة'
          checked={isSearchByPosition}
        />

        <View style={styles.buttonContainer}>
          <Button
            color={customConstants.fourthColor}
            onPress={() => confirm()}
            shadow
          >
            <Text style={{ color: '#000000' }} button>
              {is_update ? 'تعديل' : 'حفظ'}
            </Text>
          </Button>
        </View>
      </View>
      <View
        style={{
          flex: 0.3,
          // marginTop: 10,
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <Button
          firstIconName='magnifying-glass'
          secondIconName='profile'
          lastIconName='logout'
          style={{ bottom: 40, left: 40 }}
          rounded
          firstbtnfunction={() => navigation.navigate('Home')}
          secondbtnfunction={() => GoToProfile()}
          lastbtnfunction={() => {
            logout();
          }}
          multiple
        />
        <Button
          rounded
          firstIconName='arrowleft'
          style={{ bottom: 40, right: 40 }}
          firstbtnfunction={() => navigation.goBack()}
        />
      </View>
    </View>
    // </KeyboardAvoidingView>
  );
};

//------------------------------------------------//
//----------------------Styling ------------------//
//-----------------------------------------------//
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: customConstants.PrimaryColor
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
    marginTop: 10
  },
  pickerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'right',
    height: 50,
    width: '100%'
  },
  pickerItem: {
    textAlign: 'center'
  },
  form: {
    // justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    width: '100%',
    flex: 0.7
  }
});
export default Service;
