import { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const SubjectListHeaderComponent = memo(function ({
  subjectsLength,
  loading,
  toggleEditMode,
}) {
  if (subjectsLength < 1 && !loading) {
    return (
      <View style={styles.listEmptyBox}>
        <Text style={styles.listEmptyText}>Noch keine Fächer hinzugefügt</Text>
        <Icon.Feather name="arrow-down-circle" size={30} color="#8E8E93" />
      </View>
    );
  } else if (!loading) {
    return (
      <View style={styles.editBox}>
        <Pressable
          onPress={toggleEditMode}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.4 : 1,
            },
          ]}
          hitSlop={30}
        >
          <Icon.Feather name="edit-2" size={26} color={"black"} />
        </Pressable>
      </View>
    );
  }
});

export default SubjectListHeaderComponent;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  editBox: {
    alignItems: "flex-end",
    marginRight: 14,
    margin: 3,
  },
  listEmptyBox: {
    alignItems: "center",
    rowGap: 10,
    margin: 10,
  },
  listEmptyText: {
    fontSize: RFPercentage(2.05),
    fontWeight: "600",
    color: "#8E8E93",
  },
});
