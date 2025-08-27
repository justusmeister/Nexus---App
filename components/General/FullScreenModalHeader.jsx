import { View, Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

const FullScreenModalHeader = ({ title, onClose }) => {
  const { colors, fonts } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets }]}>
      <Text style={[styles.title, { color: colors.text, fontFamily: fonts.bold }]}>{title}</Text>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
        onPress={onClose}
        hitSlop={15}
      >
        <Feather name="x" size={30} color={colors.text} />
      </Pressable>
    </View>
  );
};

export default FullScreenModalHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
});
