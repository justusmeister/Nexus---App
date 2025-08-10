import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export const ThemeFadeWrapper = ({ children, themeKey }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [internalKey, setInternalKey] = useState(themeKey);

  useEffect(() => {
    if (internalKey !== themeKey) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setInternalKey(themeKey);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    } else {
      fadeAnim.setValue(1);
    }
  }, [themeKey]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
