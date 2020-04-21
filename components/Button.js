import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  View
} from 'react-native';
import * as CustomConstants from '../constants/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo, SimpleLineIcons } from '@expo/vector-icons';
class Button extends Component {
  animation = new Animated.Value(0);
  toggleMenu = () => {
    const toValue = this.open ? 0 : 1;
    Animated.spring(this.animation, {
      toValue,
      friction: 5
    }).start();
    this.open = !this.open;
  };
  render() {
    const rotation = {
      transform: [
        {
          rotate: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '90deg']
          })
        }
      ]
    };
    const pinStyle = {
      transform: [
        {
          scale: this.animation
        },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80]
          })
        }
      ]
    };
    const addServiceStyle = {
      transform: [
        {
          scale: this.animation
        },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140]
          })
        }
      ]
    };
    const logoutStyle = {
      transform: [
        {
          scale: this.animation
        },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200]
          })
        }
      ]
    };
    const opacityAnimation = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1]
    });
    const {
      style,
      opacity,
      gradient,
      color,
      startColor,
      endColor,
      end,
      start,
      locations,
      shadow,
      children,
      thirdColor,
      facebook,
      rounded,
      lastbtnfunction,
      ...props
    } = this.props;

    const btnStyle = [
      styles.btn,
      shadow && styles.shadow,
      color && styles[color],
      color && !styles[color] && { backgroundColor: color },
      style
    ];

    if (gradient && !facebook) {
      return (
        <TouchableOpacity style={btnStyle} activeOpacity={opacity} {...props}>
          <LinearGradient
            start={start}
            end={end}
            locations={locations}
            style={btnStyle}
            // angle='60'
            // useAngle='true'
            // angleCenter={{ x: 0.5, y: 0.5 }}
            colors={[startColor, endColor]}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    if (facebook) {
      return (
        <TouchableOpacity style={btnStyle} activeOpacity={opacity} {...props}>
          <LinearGradient
            // start={start}
            // end={end}
            locations={locations}
            style={btnStyle}
            angle='45'
            useAngle='true'
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={[startColor, endColor, thirdColor]}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    if (rounded) {
      return (
        <View style={[styles.roundedContainer, style]} {...props}>
          <TouchableWithoutFeedback onPress={() => lastbtnfunction()}>
            <Animated.View
              style={[
                styles.rounded,
                styles.secondary,
                logoutStyle,
                opacityAnimation
              ]}
            >
              <AntDesign
                size={20}
                name='logout'
                color={CustomConstants.second}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.rounded,
                styles.secondary,
                addServiceStyle,
                opacityAnimation
              ]}
            >
              <AntDesign size={20} name='plus' color={CustomConstants.second} />
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.rounded,
                styles.secondary,
                pinStyle,
                opacityAnimation
              ]}
            >
              <Entypo
                size={20}
                name='location-pin'
                color={CustomConstants.PrimaryColor}
              />
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.toggleMenu}>
            <Animated.View style={[styles.rounded, styles.menu, rotation]}>
              <SimpleLineIcons
                size={24}
                name='menu'
                color={CustomConstants.primary}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={btnStyle}
        activeOpacity={opacity || 0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
Button.defaultProps = {
  opacity: 0.7,
  color: CustomConstants.white,
  startColor: CustomConstants.fourthColor,
  endColor: CustomConstants.SecondColor,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  location: [0.2, 0.8]
};
const styles = StyleSheet.create({
  btn: {
    borderRadius: 7,
    height: 50,
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 16
  },
  roundedContainer: {
    alignItems: 'center',
    position: 'absolute'
  },
  rounded: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menu: {
    backgroundColor: CustomConstants.fourthColor
  },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CustomConstants.fourthColor
  },
  primary: { backgroundColor: CustomConstants.primary },
  second: { backgroundColor: CustomConstants.SecondColor },
  third: { backgroundColor: CustomConstants.thirdColor },
  fourth: { backgroundColor: CustomConstants.fourth },
  fifth: { backgroundColor: CustomConstants.fifthColor },
  primary: { backgroundColor: CustomConstants.primary },
  facebook: { backgroundColor: CustomConstants.facebookColor }
});
export default Button;
