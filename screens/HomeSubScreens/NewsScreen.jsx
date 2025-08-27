import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";

const newsBoxDummyData = [
  {
    news: "Version 1.0 ist ab jetzt draußen!",
  },
  {
    news: "Entdecke die App!",
  },
];

const NewsScreen = function () {
  const { colors, fonts } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  if (!newsBoxDummyData || newsBoxDummyData.length === 0) {
    return (
      <ScrollView contentContainerStyle={{ padding: 15, alignItems: "center" }}>
        <Text
          style={{
            fontSize: RFPercentage(2.18),
            fontWeight: "500",
            color: "#8E8E93",
          }}
        >
          Aktuell gbit es keine Nachrichten!
        </Text>
      </ScrollView>
    );
  }

  const resultBox = ({ item, index }) => (
    <View style={styles.deadlineResult}>
      <Icon.Feather name="alert-octagon" size={24} color={"#FF6F61"} />
      <Text style={styles.text}>{item.news}</Text>
    </View>
  );

  return (
    <View
    style={{
      flex: 1,
      marginTop: 5,
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth
    }}
    >
      <FlatList
        data={newsBoxDummyData}
        renderItem={resultBox}
        keyExtractor={(item) => item.news}
        style={{ padding: 8 }}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 6, 
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  deadlineResult: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#ffffff",
    marginVertical: 6,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#FF6F61",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    marginLeft: 15,
    color: "#333",
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
  },
});

export default NewsScreen;
