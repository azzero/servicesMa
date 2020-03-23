import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UserContext from '../context/UserContext';
import { AsyncStorage } from 'react-native';
import { Button, Text, Service } from '../components';
import * as CustomConstants from '../constants/constants';
import { f, db } from '../config/config';
const Home = ({ navigation }) => {
  const { logging, tokenManager } = useContext(UserContext);
  const { isLoggedIn, setisLoggedIn } = logging;
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
    console.log('inside get data');
    // db.collection('users')
    //   .add({
    //     first: 'Ada',
    //     last: 'Lovelace',
    //     born: 1815
    //   })
    //   .then(function(docRef) {
    //     console.log('Document written with ID: ', docRef.id);
    //   })
    //   .catch(function(error) {
    //     console.error('Error adding document: ', error);
    //   });
    try {
      var userId = f.auth().currentUser.uid;
      console.log('user id : ', userId);
      f.database()
        .ref('/users/' + userId)
        .set({
          username: 'test',
          email: 'test@test.com'
        });
    } catch (e) {
      console.log(e);
    }
    // .then(() => {
    //   console.log('Document successfully written!');
    // })
    // .catch(error => {
    //   console.error('Error writing document: ', error);
    // });
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Service>
          <Text> الخدمة </Text>
        </Service>
        <Service>
          <Text> service </Text>
        </Service>
      </View>
      <View style={styles.buttonContainer}>
        <Button gradient onPress={() => navigation.navigate('AddService')}>
          <Text button> أضف خدمة </Text>
        </Button>
        <Button gradient onPress={() => getdata()}>
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
    flex: 0.2,
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
