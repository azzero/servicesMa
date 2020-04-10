import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import * as CustomConstants from '../constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import Rating from './Rating';
const Service = props => {
  //-------------- state ----------------//
  const { children, title, phone, Description, userRating, ...others } = props;
  const [showPhone, setShowPhone] = useState(true);
  const windowWidth = Dimensions.get('window').width;
  // animation State
  const [activated, setActivated] = useState(new Animated.Value(0));
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [rating, setRating] = useState(userRating);
  const [RatingAlertShowed, setRatingAlertShowed] = useState(true);
  const ratingCompleted = rate => {
    // alert(rate);
    setRating(rate);
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
      toValue
    }).start();
  };
  const off = ((windowWidth - 5) * 0.7) / 2;
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
  // useEffect(() => {
  //   var key = title + phone;
  //   console.log('key value : ', key);
  // }, []);
  //rendering
  return (
    <View style={styles.container} {...others}>
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
            hitSlop={{ right: 10 }}
            onFocus={() => console.log('hover')}
            style={{ width: '100%' }}
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

      {/*--------------Rating ---------*/}
      <View style={styles.first}>
        <View style={styles.avatar}>
          <Avatar
            rounded
            size='medium'
            title='BP'
            onPress={() => console.log('Works!')}
            activeOpacity={0.7}
          />
        </View>

        <View style={styles.rating}>
          {/* <Rating
            tintColor={CustomConstants.PrimaryColor}
            type='custom'
            count={5}
            onStartRating={handleRatingClick}
            defaultRating={5}
            imageSize={20}
            onFinishRating={val => ratingCompleted(val)}
            defaultRating={rating}
            // showReadOnlyText={true}
          /> */}
          <Rating rating={5} />
        </View>
      </View>
    </View>
  );
};

//------------------------------------------------//
//---------------------Styling ------------------//
//-----------------------------------------------//

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    backgroundColor: CustomConstants.PrimaryColor,
    borderRadius: 6,
    marginTop: 10
  },
  info: {
    flex: 0.6,
    borderRightColor: '#ffffff',
    borderRightWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  first: {
    justifyContent: 'center',
    flex: 0.4
    // borderColor: 'blue',
    // borderWidth: 2
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,

    borderBottomColor: '#ffffff',
    borderBottomWidth: 2
  },

  rating: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
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
