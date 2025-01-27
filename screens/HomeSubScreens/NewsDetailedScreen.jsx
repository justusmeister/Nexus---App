import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import * as Icon from "@expo/vector-icons";

const NewsDetailedScreen = function ({ data }) {
  if (!data || data.length === 0) {
    return (
      <ScrollView contentContainerStyle={{ padding: 15, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: "#8E8E93",
          }}
        >
          Aktuell gbit es keine Neuigkeiten!
        </Text>
      </ScrollView>
    );
  }

  const resultBox = ({ item, index }) => (
    <View style={styles.deadlineResult}>
      <Icon.FontAwesome name="exclamation-circle" size={24} color={"#FF6F61"} />
      <Text style={styles.text}>{item.news}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={resultBox}
      keyExtractor={(item) => item.news}
      style={{ padding: 8 }}
    />
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
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NewsDetailedScreen;
