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
  const prevEditModeRef = useRef(editMode);
  const openByEditModeRef = useRef(false);

  // Connect to external ref system
  useEffect(() => {
    if (externalSwipeableRef) {
      externalSwipeableRef(localSwipeRef.current);
    }
  }, [externalSwipeableRef]);

  // Handle editMode changes
  useEffect(() => {
    // Edit mode activated: open all swipeables
    if (editMode && !prevEditModeRef.current) {
      if (localSwipeRef.current) {
        localSwipeRef.current.openRight();
        openByEditModeRef.current = true;
      }
    }
    // Edit mode deactivated: close all swipeables that were opened by edit mode
    else if (!editMode && prevEditModeRef.current) {
      if (localSwipeRef.current && openByEditModeRef.current) {
        localSwipeRef.current.close();
        openByEditModeRef.current = false;
      }
    }
    
    prevEditModeRef.current = editMode;
  }, [editMode]);

  const handleSwipeOpen = () => {
    // If not opened by edit mode and not in edit mode, set as active swipe
    if (!openByEditModeRef.current && !editMode) {
      setActiveSwipe(id);
    }
  };

  const handleSwipeClose = () => {
    // Only manage active state if not in edit mode
    if (!editMode) {
      clearActiveSwipe(id);
    }
    // Reset the edit mode open flag if closed manually while in edit mode
    if (editMode) {
      openByEditModeRef.current = false;
    }
  };

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <RectButton
        style={styles.deleteButton}
        onPress={() => {
          onPressDelete();
          // Only auto-close if not in edit mode
          if (!editMode) {
            localSwipeRef.current?.close();
          }
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