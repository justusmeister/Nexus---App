import {
    View,
    Text,
    StyleSheet,
    Pressable,
  } from "react-native";
  import * as Icon from "@expo/vector-icons";
import { useRoute, useTheme } from "@react-navigation/native";


const TopSection = ({ title, subtitle, onBack }) => {
    const { colors, fonts } = useTheme();

    const navigation = useRoute();

    return (
      <View style={styles.topSection}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          {
            opacity: pressed ? 0.6 : 1,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        hitSlop={12}
      >
        <Icon.Feather name="arrow-left" size={22} color={colors.text} />
      </Pressable>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontFamily: fonts.bold }]}>
            {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + "AA", fontFamily: fonts.regular }]}>
            {subtitle}
        </Text>
      </View>
    </View>
    );
};

const styles = StyleSheet.create({
    topSection: {
      marginTop: 60,
      marginBottom: 32,
    },
    backButton: {
      alignSelf: "flex-start",
      padding: 6,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4.65,
      elevation: 8,
    },
    header: {
      marginTop: 24,
    },
    title: {
      fontSize: 26,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 15,
    },
    
  });
  
  export default TopSection;
  