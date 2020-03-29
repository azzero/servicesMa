import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UserContext from '../context/UserContext';
import DataContext from '../context/DataContext';
import { AsyncStorage } from 'react-native';
import { Button, Text, Service } from '../components';
import * as CustomConstants from '../constants/constants';
import { auth, db, fr, f } from '../config/config';

//-------------- Home Screen ---------------------//
const Home = ({ navigation }) => {
  const { data, setData } = useContext(DataContext);

  // const [data, setData] = useState(null);
  const { logging, tokenManager } = useContext(UserContext);
  const { isLoggedIn, setisLoggedIn } = logging;
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
      const docs = await fr
        .collection('services')
        .doc('اسفي')
        .collection('كهربائي')
        .get();
      let list = [];
      docs.forEach(doc => {
        list.push(doc.data());
        // setData([...data, row]);
      });
      setData(list);
      navigation.navigate('DisplayServices');
    } catch (e) {
      console.log(e);
    }
  };

  //---------------- USE EFFECT-------------//

  //----------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <View style={styles.buttonContainer}>
        <Button gradient onPress={() => navigation.navigate('AddService')}>
          <Text button> أضف خدمة </Text>
        </Button>
        <Button gradient onPress={() => getdata()}>
          <Text button> get data </Text>
        </Button>
        <Button gradient onPress={() => logout()}>
          <Text button> logout </Text>
        </Button>
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
    borderColor: 'blue',
    borderWidth: 2,
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 0.4,
    alignSelf: 'center',
    marginVertical: 10,
    bottom: 0,
    width: '80%'
  }
});
export default Home;
{
  /* <Text>Home screen </Text>
        <Button onPress={logout}>
          <Text> logout </Text>
        </Button>
        <Button onPress={getdata}>
          <Text> token </Text>
        </Button>
      </View> */
}
