import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Icon from "@expo/vector-icons";

const AppleStyleSwipeableRow = ({
  children,
  id,
  setActiveSwipe,
  clearActiveSwipe,
  onPressDelete,
  editMode,
  swipeableRef: externalSwipeableRef,
}) => {
  const localSwipeRef = useRef(null);
  useEffect(() => {
    if (externalSwipeableRef) {
      externalSwipeableRef(localSwipeRef.current);
    }
  }, [externalSwipeableRef]);

  const handleSwipeOpen = () => {
    setActiveSwipe(id);
  };

  const handleSwipeClose = () => {
    clearActiveSwipe(id);
  };

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <RectButton
        style={styles.deleteButton}
        onPress={() => {
          onPressDelete();
          localSwipeRef.current?.close();
        }}
      >
        <Icon.Feather
          name="trash-2"
          size={28}
          color="white"
        />
      </RectButton>
    </View>
  );

  return (
    <Swipeable
      ref={localSwipeRef}
      friction={1.7}
      enableTrackpadTwoFingerGesture
      rightThreshold={50}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeOpen}
      onSwipeableClose={handleSwipeClose}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 30,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#dd2c00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppleStyleSwipeableRow;
