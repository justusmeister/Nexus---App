import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useNavigation, getFocusedRouteNameFromRoute } from "@react-navigation/native";

function getRootTabNav(navigation) {
  let nav = navigation;
  while (nav?.getParent?.()) {
    if (nav?.getParent?.()?.getState?.()?.type === "tab") {
      return nav.getParent();
    }
    nav = nav.getParent();
  }
  return null;
}

const FadeInTab =  function ({ children, duration = 180, style }) {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
  
    useEffect(() => {
      const parentNav = getRootTabNav(navigation);
      if (!parentNav) return;
  
      let lastTabName = parentNav.getState().routes[parentNav.getState().index].name;
  
      const runFade = () => {
        fadeAnim.setValue(0.85); 
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad), 
          useNativeDriver: true,
        }).start();
      };
  
      const unsubTab = parentNav.addListener("tabPress", () => {
        const state = parentNav.getState();
        const currentTab = state.routes[state.index].name;
        
        if (currentTab === lastTabName) return;

        runFade();
        lastTabName = parentNav.getState().routes[parentNav.getState().index].name;
      });
  
      const unsubFocus = navigation.addListener("focus", () => {
        const currentTab = parentNav.getState().routes[parentNav.getState().index].name;
        if (currentTab !== lastTabName) {
          runFade();
          lastTabName = currentTab;
        }
      });
  
      return () => {
        unsubTab();
        unsubFocus();
      };
    }, [navigation, fadeAnim, duration]);
  
    return (
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }, style]}>
        {children}
      </Animated.View>
    );
  };
  
  export default FadeInTab;