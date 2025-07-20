import { View, Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FocusHeader = ({ onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets }]}>
      <Text style={styles.title}>Fokusmodus</Text>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
        onPress={onClose}
        hitSlop={15}
      >
        <Feather name="x" size={24} color="#333" />
      </Pressable>
    </View>
  );
};

export default FocusHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
