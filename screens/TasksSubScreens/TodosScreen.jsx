import { useLayoutEffect, useRef, useCallback, useState, useEffect, memo } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Icon from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { RFPercentage } from "react-native-responsive-fontsize";

const TodosScreen = function ({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View
          style={[styles.deadlineListView, ]}
        >
          <Text style={styles.sectionTitle}>
            Karsten
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a1a1a1",
  },
  monthOverviewContainer: {
    flex: 1,
    justifyContent: "center",
  },
  deadlineListView: {
    height: "50%",
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#EFEEF6",
  },
  sectionTitle: {
    fontSize: RFPercentage(2.44),
    fontWeight: "600",
    padding: 10,
    marginLeft: 10,
  },
  emptyListText: {
    width: "100%", 
    textAlign: "center",
    fontSize: RFPercentage(2),
    fontWeight: "500",
    color: "#8E8E93",
  }
});

export default memo(TodosScreen);