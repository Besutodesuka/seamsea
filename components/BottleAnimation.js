import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

export default function BottleAnimation({ selectedItem, onFinish, rng_fn }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const shakeAnimation = new Animated.Value(0);
  const stickFallAnimation = new Animated.Value(0);
  const stickFlyAnimation = new Animated.Value(0);

  const startAnimation = () => {
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stick falls out
      Animated.timing(stickFallAnimation, {
        toValue: 1,
        duration: 800,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start(() => {
        // Stick flies up
        Animated.timing(stickFlyAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }).start(() => {
          setAnimationComplete(true);
          onFinish(); // Notify parent component that animation is done
          // setAnimationComplete(false);
        });
      });
    });
  };

  // Interpolations for animations
  const shake = shakeAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const fall = stickFallAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  const fly = stickFlyAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200],
  });

  return (
    <View style={styles.container}>
      {/* SVG for bottle */}
      <Animated.View style={{ transform: [{ rotate: shake }] }}>
        <Svg height="200" width="100">
          <Rect x="30" y="20" width="40" height="150" fill="blue" />
          <Rect x="40" y="0" width="20" height="20" fill="blue" />
        </Svg>
      </Animated.View>

      {/* Animated stick */}
      {!animationComplete && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 150,
            left: 50,
            transform: [{ translateY: fall }, { translateY: fly }],
          }}
        >
          <Svg height="100" width="10">
            <Line x1="0" y1="0" x2="0" y2="100" stroke="brown" strokeWidth="5" />
          </Svg>
        </Animated.View>
      )}

      {/* Result text */}
      {animationComplete && (
        <Animated.Text style={[styles.result, { transform: [{ translateY: fly }] }]}>
          {selectedItem}
        </Animated.Text>
      )}

      {/* Start Animation Button */}
      <Button title="Start Randomizer" onPress={() => {rng_fn(); startAnimation();}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    bottom: 300,
  },
});
