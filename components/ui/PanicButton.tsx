import React, { useState, useRef } from 'react';
import { Pressable, StyleSheet, Animated, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeHerColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface PanicButtonProps {
  onLongPress: () => void;
  size?: number;
  style?: ViewStyle;
}

export function PanicButton({
  onLongPress,
  size = 200,
  style,
}: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = () => {
    setIsPressed(true);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    
    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    
    // Set timer for long press
    pressTimer.current = setTimeout(() => {
      handleLongPress();
    }, 3000);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    
    // Clear timer
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    // Reset animations
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleLongPress = () => {
    // Strong haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Reset state
    setIsPressed(false);
    progressAnim.setValue(0);
    scaleAnim.setValue(1);
    
    // Clear timer
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    // Call the callback
    onLongPress();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const buttonStyles = [
    styles.button,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={buttonStyles}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Progress indicator */}
        {isPressed && (
          <Animated.View
            style={[
              styles.progressIndicator,
              {
                width: progressWidth,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          />
        )}
        
        {/* Button content */}
        <IconSymbol 
          name="exclamationmark.triangle.fill" 
          size={size * 0.24} 
          color="white" 
        />
        <ThemedText style={[styles.buttonText, { fontSize: size * 0.08 }]}>
          Emergency
        </ThemedText>
        <ThemedText style={[styles.buttonSubtext, { fontSize: size * 0.06 }]}>
          Hold for 3 seconds
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: SafeHerColors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  progressIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
});