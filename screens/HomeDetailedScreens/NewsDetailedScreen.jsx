import { View, Text, StyleSheet, FlatList } from "react-native";

const NewsDetailedScreen = function ({ data }) {
  const resultBox = ({ item }) => (
    <View style={styles.deadlineResult}>
      <Text style={{ color: "white", fontSize: 15 }}>{item.news}</Text>
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
    width: "100%",
    height: 100,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    padding: 8,
    backgroundColor: "#444",
  },
});

export default NewsDetailedScreen;
