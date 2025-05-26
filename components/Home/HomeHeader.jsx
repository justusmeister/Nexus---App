import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import * as Icon from "@expo/vector-icons";

const HomeHeader = ({ onLeftPress, onMiddlePress, onRightPress }) => {
  return (
    <View style={styles.container}>
      <IconButton icon="list" label="Heute" onPress={onLeftPress} />
      <IconButton icon="target" label="Fokus" onPress={onMiddlePress} />
      <IconButton icon="plus" label="Hinzufügen" onPress={onRightPress} />
    </View>
  );
};

const IconButton = ({ icon, label, onPress }) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.4 : 1 }]}
        onPress={onPress}
      >
        <Icon.Feather name={icon} size={28} color="#333" />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  wrapper: {
    alignItems: "center",
    width: "30%",
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.065)",
    borderWidth: 1,
    borderColor: "#c6c6c6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "darkgray",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
});

export default HomeHeader;
