import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as Icon from "@expo/vector-icons";
import { memo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomHeader = function ({ title, onSettingsPress }) {
  const { colors, fonts, spacing } = useTheme();
  insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: colors.background, borderBottomColor: colors.border, paddingTop: insets.top },
      ]}
    >
      <View
        style={[
          styles.headerContainer,
          { paddingHorizontal: spacing?.md || 16 },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: fonts?.bold || "System" },
          ]}
        >
          {title}
        </Text>

        {onSettingsPress && (
          <Pressable
            onPress={onSettingsPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
            hitSlop={12}
          >
            <Icon.Feather name="settings" size={27.5} color={colors.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContainer: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
  },
});

export default CustomHeader;
