import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Input, Button } from '../components';
import validate from 'validate.js';
import constraints from '../constants/constraints';
import { auth, db, f } from '../config/config';
const Service = () => {
  const [name, setName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [tele, setTele] = useState('');
  const [nameErrors, setNameerrors] = useState('');
  const [serviceErrors, setServiceerrors] = useState('');
  const [teleErrors, setTeleerrors] = useState('');
  const nameRef = React.createRef();
  const serviceRef = React.createRef();
  const teleRref = React.createRef();
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
    console.log(validationResult);
    if (typeof validationResult === 'undefined') {
      try {
        alert('checking valide ');
        const cityRef = f.database().ref('/services/' + name);
        const newServiceRef = cityRef.push();
        newServiceRef.set({
          serviceTitle: serviceTitle,
          tele: tele
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
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
        ref={teleRref}
        errorMessage={teleErrors}
        inputHandler={setTeleHandler}
        style={{ color: '#000000', textAlign: 'right' }}
        placeholder='رقم الهاتف'
        value={tele}
      />
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
  }
});
export default Service;
