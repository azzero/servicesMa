import React, { useState } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { Text, Input, Button } from '../components';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { auth, db, f, fr } from '../config/config';
import { Dropdown } from 'react-native-material-dropdown';
import * as customConstants from '../constants/constants';
import { FontAwesome } from '@expo/vector-icons';
const Service = () => {
  //---------------Some params ---------------------------//
  const currentUser = f.auth().currentUser;
  //----------------State --------------------------------//
  const [name, setName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [tele, setTele] = useState('');
  const [Description, setDescription] = useState('');
  const [nameErrors, setNameerrors] = useState('');
  const [serviceErrors, setServiceerrors] = useState('');
  const [teleErrors, setTeleerrors] = useState('');
  const [DescriptionErrors, setDescriptionErrors] = useState('');
  const [city, setCity] = useState('');
  //------------------ REFERENCES --------------------------//
  const nameRef = React.createRef();
  const serviceRef = React.createRef();
  const teleRref = React.createRef();
  const DescriptionRref = React.createRef();
  //------------------SetState Handler --------------------//

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
  //------------ Picker handler --------------------//
  const pickerHandler = value => {
    setCity(value);
  };
  //-------------------Submit ----------------------//
  const confirm = () => {
    const validationResult = validate(
      { name: name, service: serviceTitle, tele: tele },
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
      serviceRef.current.shake();
    }
    if (typeof validationResult !== 'undefined' && validationResult.tele) {
      const error3 = validationResult.tele[0];
      setTeleerrors(error3);
      teleRref.current.shake();
    }
    if (typeof validationResult === 'undefined') {
      try {
        const cityRef = f.database().ref('/services/' + name);
        const newServiceRef = cityRef.push();
        newServiceRef.set({
          serviceTitle: serviceTitle,
          tele: tele
        });
        fr.collection('services')
          .doc(city)
          .collection(serviceTitle)
          .add({
            name: name,
            Description: Description,
            tele: tele,
            userID: currentUser.uid
          })
          .then(function() {
            console.log('Document successfully written!');
          })
          .catch(function(error) {
            console.error('Error writing document: ', error);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const testFirestore = async () => {
    fr.collection('users')
      .doc('LA')
      .set({
        name: 'Los Angeles',
        username: 'CA',
        avatar: 'USA'
      })
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });
  };
  //-------------------- Render ----------------------//
  return (
    <View style={styles.container}>
      <Input
        ref={nameRef}
        inputHandler={setNameHandler}
        errorMessage={nameErrors}
        style={{ color: '#000000' }}
        placeholder='الاسم'
        value={name}
      />
      <Input
        ref={serviceRef}
        errorMessage={serviceErrors}
        inputHandler={setServiceTitleHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        placeholder='نوع الخدمة'
      />
      <Input
        ref={DescriptionRref}
        errorMessage={DescriptionErrors}
        inputHandler={setDescriptionHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        placeholder='وصف الخدمة'
        value={Description}
      />
      <Input
        ref={teleRref}
        errorMessage={teleErrors}
        inputHandler={setTeleHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        placeholder='رقم الهاتف'
        value={tele}
      />
      <View
        style={{
          height: 90,
          width: '80%',
          // justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Dropdown
          data={customConstants.MoroccoCities}
          itemTextStyle={{ textAlign: 'right' }}
          containerStyle={{
            width: '100%'
          }}
          dropdownOffset={{ top: 10, left: 0 }}
          onChangeText={value => {
            pickerHandler(value);
          }}
          pickerStyle={{ borderRadius: 10 }}
          itemTextStyle={{
            borderBottomColor: customConstants.grayColor,
            borderBottomWidth: 1,
            textAlign: 'center',
            paddingBottom: 4,
            margin: 1
          }}
          rippleInsets={{ top: 0, bottom: 0 }}
          renderAccessory={() => {
            if (city === '') {
              return (
                <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
                  <View style={{ width: '80%', left: 0 }}>
                    <FontAwesome name='chevron-down' size={20} color='gray' />
                  </View>

                  <Text
                    style={{
                      color: customConstants.grayColor,
                      textAlign: 'right'
                    }}
                  >
                    المدينة
                  </Text>
                </View>
              );
            }
          }}
          itemCount='7'
          value={city}
          rippleCentered={true}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button color='green' onPress={() => confirm()} shadow>
          <Text style={{ color: 'white' }} button>
            {' '}
            أضف{' '}
          </Text>
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'right'
  },
  buttonContainer: {
    marginVertical: 20,
    width: '50%'
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
  }
});
export default Service;
