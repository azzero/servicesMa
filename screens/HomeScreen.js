import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UserContext from '../context/UserContext';
import DataContext from '../context/DataContext';
import { AsyncStorage } from 'react-native';
import { Button, Text, Service } from '../components';
import * as CustomConstants from '../constants/constants';
import { auth, fr, geo } from '../config/config';
import LocalisationContext from '../context/LocalisationContext';
import AskLocalisation from '../components/AskLocalisation';
import { get } from 'geofirex';
//-------------- Home Screen ---------------------//
const Home = props => {
  const { navigation } = props;
  const { data, setData } = useContext(DataContext);
  const { position, askingPosition } = useContext(LocalisationContext);
  const { localisation, setlocalisation } = position;
  // const [data, setData] = useState(null);
  const { logging, tokenManager } = useContext(UserContext);
  const { isLoggedIn, setisLoggedIn } = logging;
  const { asklocalisationpopup, setasklocalisationpopup } = askingPosition;
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
        .doc('اسفي')
        .collection('نجار');
      // const center = geo.point(localisation.latitude, localisation.longitude);
      const center = geo.point(32.2614456, -9.2475532);
      const radius = 100;
      const field = 'location';
      const query = geo.query(services).within(center, radius, field);
      const docs = await get(query);
      // const docs = await fr
      //   .collection('services')
      //   .doc('اسفي')
      //   .collection('نجار')
      //   .get();
      // let list = [];
      // docs.forEach(doc => {
      //   list.push(doc.data());
      //   // setData([...data, row]);
      // });
      console.log('documents : ', docs);
      setData(docs);
      navigation.navigate('DisplayServices');
    } catch (e) {
      console.log(e);
    }
  };

  //----------------------------------------
  if (asklocalisationpopup === false) {
    console.log('inside popup condition');
    return <AskLocalisation {...props} />;
  }
  console.log('lol : ', localisation);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text>
          {localisation &&
            `your localisation is longitude : ${localisation.longitude} latitude : ${localisation.latitude} `}
        </Text>
      </View>
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
