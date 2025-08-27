import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

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
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? 0.4 : 1,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
      >
        <Icon.Feather name={icon} size={28} color={colors.text} />
      </Pressable>
      <Text style={[styles.label, { color: colors.text, fontFamily: fonts.regular }]}>{label}</Text>
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
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4.65,
      elevation: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
  },
});

export default HomeHeader;
