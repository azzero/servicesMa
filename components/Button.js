import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as CustomConstants from '../constants/constants';
import { LinearGradient } from 'expo-linear-gradient';

class Button extends Component {
  render() {
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
  primary: { backgroundColor: CustomConstants.primary },
  second: { backgroundColor: CustomConstants.SecondColor },
  third: { backgroundColor: CustomConstants.thirdColor },
  fourth: { backgroundColor: CustomConstants.fourth },
  fifth: { backgroundColor: CustomConstants.fifthColor },
  primary: { backgroundColor: CustomConstants.primary },
  facebook: { backgroundColor: CustomConstants.facebookColor }
});
export default Button;
