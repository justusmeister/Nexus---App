import { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation, useTheme } from "@react-navigation/native";

const SubjectListFooterComponent = memo(({ handleOpen }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const { colors, fonts } = useTheme();

  const navigation = useNavigation();

  return (
    <View>
      <View>
        <Pressable
          style={({ pressed }) => [
            styles.addSubjectButton,
            { opacity: pressed ? 0.6 : 0.9, backgroundColor: colors.primary },
          ]}
          onPress={handleOpen}
        >
          <Icon.Feather name="plus-square" size={26} color="white" />
          <Text style={[styles.subjectText, { fontFamily: fonts.bold }]}>Fach hinzufügen</Text>
        </Pressable>
      </View>

      <View style={styles.dividingLineBox}>
        <View style={[styles.dividingLine, { backgroundColor: colors.border, height: StyleSheet.hairlineWidth }]} />
      </View>

      <View style={{ paddingBottom: tabBarHeight + 11 }}>
        <Pressable
          style={styles.notesButton}
          onPress={() => navigation.navigate("NotesScreen")}
        >
          <Icon.FontAwesome name="sticky-note-o" size={30} color="white" />
          <Text style={[styles.notesButtonText, { fontFamily: fonts.bold }]}>allgemeine Notizen</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default SubjectListFooterComponent;

const styles = StyleSheet.create({
  subjectText: {
    marginLeft: 15,
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "white",
  },
  notesButtonText: {
    marginLeft: 15,
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "white",
  },
  notesButton: {
    width: "auto",
    height: 85,
    marginTop: 20,
    backgroundColor: "#d1a336",
    borderRadius: 24,
    padding: 15,
    marginHorizontal: 14,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  dividingLineBox: {
    alignItems: "center",
    marginTop: 7.5,
  },
  dividingLine: {
    width: "95%",
  },
  addSubjectButton: {
    width: "auto",
    height: 50,
    margin: 20,
    flexDirection: "row",
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
