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
var windowWidth = Dimensions.get('window').width;
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
  // animation State
  const [activated, setActivated] = useState(new Animated.Value(0));
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [customRating, setCustomRating] = useState(userRating);
  const [RatingAlertShowed, setRatingAlertShowed] = useState(true);
  // ------------------- Context--------------------------//
  const { ratingServicesManager } = useContext(UserContext);
  const { ratedServices, setRatedServices } = ratingServicesManager;
  //---------- phone number Formate -------------- //
  const phoneNumber = () => {
    let result = [phone[0].toString()];
    for (let i = 1; i <= phone.length; i++) {
      if (i % 2 === 0) {
        result.push('-', phone[i]);
      } else {
        result.push(phone[i]);
      }
    }
    return result;
  };
  //---------------- handle rating function ----------------- //
  const handleRating = value => {
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
          let ratedServicesNewList = [];
          if (ratedServices !== null) {
            ratedServicesNewList = ratedServices;
          }
          ratedServicesNewList.push(id);
          setRatedServices(ratedServicesNewList);
          await AsyncStorage.setItem(
            '@zizuAppStore:services',
            JSON.stringify(ratedServicesNewList)
          );
        } catch (error) {
          // Error saving data
          console.log('error while saving data :', error);
        }
      })
      .catch(e => {
        alert('error');
        console.log('error : ', e);
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
  const off = windowWidth / 2 - 45;
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
              color: CustomConstants.SecondColor,
              paddingHorizontal: 5
            }}
            numberOfLines={3}
          >
            {Description}
          </Text>
        </View>

        <View style={styles.description}>
          {/* -------------------- Phone animation------------------------- */}
          {/*---------------------------------------------------- */}
          <TouchableWithoutFeedback
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            style={{
              width: '100%'
            }}
            onPress={() => {
              animationHandler();
            }}
          >
            <View
              style={{
                width: '100%'
              }}
            >
              <Animated.View
                style={[styles.phoneZone, animatedStyles.phoneIcon]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                    // marginBottom: 5
                  }}
                >
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={[styles.phoneText, {}]}>
                      {phone && phoneNumber()}
                    </Text>
                  </View>
                  <View style={{}}>
                    <FontAwesome name='mobile-phone' size={42} color='#fff' />
                  </View>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: CustomConstants.SecondColor,
          borderTopWidth: 1
        }}
      >
        <Rating
          userRating={customRating}
          handleRating={handleRating}
          id={id}
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
    // borderRadius: 6,
    borderTopWidth: 5,
    borderTopColor: '#fff'
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
    backgroundColor: CustomConstants.PrimaryColor,
    width: '100%',
    // borderTopColor: 'gray',
    // borderTopWidth: 1,
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  phoneText: {
    fontSize: CustomConstants.sizes.title,
    color: '#fff'
  },
  phoneZone: {
    width: windowWidth / 2
  }
});
export default Service;
