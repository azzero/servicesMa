import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  AsyncStorage
} from 'react-native';
import * as CustomConstants from '../constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import UserContext from '../context/UserContext';
import Rating from './Rating';
import { fr } from '../config/config';
const Service = props => {
  //-------------- state ----------------//
  const {
    children,
    title,
    phone,
    Description,
    service,
    city,
    id,
    userRating,
    ...others
  } = props;
  const [showPhone, setShowPhone] = useState(true);
  var windowWidth = Dimensions.get('window').width;
  // animation State
  const [activated, setActivated] = useState(new Animated.Value(0));
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [customRating, setCustomRating] = useState(userRating);
  const [RatingAlertShowed, setRatingAlertShowed] = useState(true);
  // ------------------- Context--------------------------//
  const { ratingServicesManager } = useContext(UserContext);
  const { ratedServices, setRatedServices } = ratingServicesManager;
  //---------------- handle rating function ----------------- //
  const handleRating = value => {
    if (ratedServices.includes(id)) {
      alert('سبق لك تقييم هذه الخدمة ');
      return;
    }
    if (typeof customRating !== 'undefined') {
      var newRating = customRating.map((item, i) => {
        if (i == value - 1) {
          return (item = item + 1);
        } else {
          return item;
        }
      });
    } else {
      const empty_array = [0, 0, 0, 0, 0];
      var newRating = empty_array.map((item, i) => {
        if (i == value - 1) {
          return (item = item + 1);
        } else {
          return item;
        }
      });
    }

    setCustomRating(newRating);
    var docRef = fr
      .collection('services')
      .doc(city)
      .collection(service)
      .doc(id);
    docRef
      .update({
        rating: newRating
      })
      .then(async () => {
        try {
          console.log('rating updated ');

          let ratedServicesNewList = ratedServices;
          ratedServicesNewList.push(id);
          setRatedServices(ratedServicesNewList);
          await AsyncStorage.setItem(
            '@zizuAppStore:services',
            JSON.stringify(ratedServicesNewList)
          );
        } catch (error) {
          // Error saving data
          console.log('error while saving data :', e);
        }
      })
      .catch(e => {
        alert('error');
      });
  };
  //--------------- Function --------------//
  const handleRatingClick = () => {
    if (RatingAlertShowed) {
      setRatingAlertShowed(false);
      alert('للتقييم إبق ضاغط و اسحب إلى اليمين أو اليسار ');
    }
    console.log(RatingAlertShowed);
  };

  // Animation Function
  const animationHandler = () => {
    setShowPhone(!showPhone);
    onStartAnimation();
  };
  const onStartAnimation = () => {
    const toValue = activated ? 0 : 1;
    setActivated(!activated);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true
    }).start();
  };
  const off = windowWidth / 2 + 10;
  const animatedStyles = {
    phoneIcon: {
      transform: [
        {
          translateX: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [off, 0]
          })
        }
      ]
    }
  };
  //---------------- UseEffect ----------------//
  //rendering
  return (
    <View style={styles.container} {...others}>
      {/* <View style={{ flex: 0.8, flexDirection: 'row' }}> */}
      <View style={styles.info}>
        <View style={styles.title}>
          <Text
            style={{
              fontSize: CustomConstants.sizes.h1,
              textAlign: 'center',
              fontFamily: CustomConstants.ShebaYeFont,
              color: CustomConstants.fourthColor
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: CustomConstants.sizes.body,
              textAlign: 'center',
              color: 'gray'
            }}
          >
            {Description}
          </Text>
        </View>

        <View style={styles.description}>
          {/* -------------------- Phone------------------------- */}
          {/*---------------------------------------------------- */}
          <TouchableWithoutFeedback
            hitSlop={{ right: 20 }}
            onFocus={() => console.log('hover')}
            style={{
              width: '100%',
              paddingHorizontal: 10
            }}
            onPress={() => animationHandler()}
          >
            <Animated.View style={[animatedStyles.phoneIcon]}>
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <View style={{ justifyContent: 'center' }}>
                  <Text style={[styles.phoneText, {}]}>0665000000</Text>
                </View>
                <View style={{ padding: 15 }}>
                  <FontAwesome name='mobile-phone' size={42} color='#ffffff' />
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: 'white',
          borderWidth: 1
        }}
      >
        <Rating
          userRating={customRating}
          handleRating={handleRating}
          {...others}
        />
      </View>
    </View>
  );
};

//------------------------------------------------//
//---------------------Styling ------------------//
//-----------------------------------------------//

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: CustomConstants.PrimaryColor,
    borderRadius: 6,
    marginTop: 10
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    flex: 0.6,
    width: '100%'
  },
  description: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  phoneText: {
    fontSize: CustomConstants.sizes.title,
    color: '#ffffff'
  }
});
export default Service;
