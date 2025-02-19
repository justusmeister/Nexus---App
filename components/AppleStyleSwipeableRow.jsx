import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Icon from "@expo/vector-icons";

const AppleStyleSwipeableRow = ({
  children,
  onSwipeOpen,
  id,
  activeSwipeId,
  onPressDelete,
}) => {
  const swipeableRef = useRef(null);

  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <RectButton
          style={styles.deleteButton}
          onPress={() => {
            swipeableRef.current?.close();
            onPressDelete();
          }}
        >
          <Icon.MaterialCommunityIcons
            name="delete-forever"
            size={32}
            color="white"
          />
        </RectButton>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1.7}
      enableTrackpadTwoFingerGesture
      rightThreshold={50}
      renderRightActions={renderRightActions}
      shouldOpen={activeSwipeId === id}
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
    marginBottom: 15,
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
