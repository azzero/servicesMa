import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Text
} from 'react-native';
import * as CustomConstants from '../constants/constants';
import { FontAwesome } from '@expo/vector-icons';
import UserContext from '../context/UserContext';

const Rating = ({
  userRating,
  numStarts,
  color,
  handleRating,
  id,
  reviewers
}) => {
  //------------------------------------------------//
  //------------------------State------------------//
  //-----------------------------------------------//

  const [rating, setRating] = useState([0, 0, 0, 0, 0]);
  const [animation, setAnimation] = useState(new Animated.Value(1));
  let stars = [];
  //-------------------- Context -----------------//
  const { ratingServicesManager } = useContext(UserContext);
  const { ratedServices, setRatedServices } = ratingServicesManager;
  //   const animation = new Animated.Value(1);
  //------------------------------------------------//
  //---------------------Animation------------------//
  //-----------------------------------------------//
  const animate = () => {
    Animated.timing(animation, {
      toValue: 2,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(animation.setValue(1));
  };
  const animationScale = animation.interpolate({
    inputRange: [1, 1.5, 2],
    outputRange: [1, 1.4, 1]
  });
  const animationOpacity = animation.interpolate({
    inputRange: [1, 1.2, 2],
    outputRange: [1, 0.5, 1]
  });
  const animationRotate = animation.interpolate({
    inputRange: [1, 1.25, 1.75, 2],
    outputRange: ['0deg', '-3deg', '3deg', '0deg']
  });
  const animationStyle = {
    transform: [
      {
        scale: animationScale
      },
      { rotate: animationRotate }
    ],
    opacity: animationOpacity
  };
  //------------------------------------------------//
  //-----------------------UseEffect---------------//
  //-----------------------------------------------//
  useEffect(() => {
    // var stars = [0, 0, 2, 3, 5],
    if (typeof userRating !== 'undefined') {
      var count = 0,
        sum = userRating.reduce(function(sum, item, index) {
          count += item;
          return sum + item * (index + 1);
        }, 0),
        result = Math.round(sum / count);

      setRating(result);
    }
  }, [userRating]);

  //------------------------------------------------//
  //----------------Star Component------------------//
  //-----------------------------------------------//
  const Star = props => (
    <FontAwesome
      name={props.filled === true ? 'star' : 'star-o'}
      color={color}
      size={20}
      style={{ marginHorizontal: 6 }}
    />
  );
  //------------------------------------------------//
  //---------------handling Click-------------------//
  //-----------------------------------------------//
  const handleClick = star => {
    console.log('list of services :', ratedServices);
    if (ratedServices !== null && ratedServices.includes(id)) {
      alert('سبق لك تقييم هذه الخدمة ');
      return;
    }
    setRating(star);
    handleRating(star);
  };
  for (let x = 1; x <= numStarts; x++) {
    stars.push(
      <TouchableWithoutFeedback
        key={x}
        onPress={() => {
          handleClick(x), animate();
        }}
      >
        <Animated.View style={x <= rating ? animationStyle : ''}>
          <Star filled={x <= rating ? true : false} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row'
          //   position: 'absolute'
        }}
      >
        <Text style={{ color: CustomConstants.SecondColor, fontSize: 16 }}>
          ({reviewers})
        </Text>
        {stars}
      </View>
    </View>
  );
};

Rating.defaultProps = {
  rating: 1,
  numStarts: 5,
  color: 'yellow',
  reviewers: 0
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  star: {}
});

export default Rating;
