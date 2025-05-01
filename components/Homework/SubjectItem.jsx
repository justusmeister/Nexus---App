import { useRef, memo, useCallback } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

const SubjectItem = memo(function ({ item, editMode, swipeableRefs, activeSwipeRef, setActiveSwipe, clearActiveSwipe, deleteSubject }) {
    const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate("GenericScreen", {
      subject: item.subject,
      color: item.color,
    });
  }, [item.subject, item.color, navigation]);

  const handlePressDelete = useCallback(() => {
    Alert.alert(
      "Möchten sie dieses Fach wirklich löschen?",
      "Das Fach wird samt Inhalt unwiderruflich gelöscht!",
      [
        {
          text: "Abbrechen",
        },
        {
          text: "Löschen",
          onPress: () => {
            deleteSubject(item.subject);
          },
          style: "destructive",
        },
      ]
    );
  }, [item.subject]);

  return item.id === "loading-indicator" ? (
    <ActivityIndicator
      size="small"
      color="#333"
      style={{ marginVertical: 20, alignSelf: "center" }}
    />
  ) : (
    <AppleStyleSwipeableRow
      onPressDelete={handlePressDelete}
      id={item.id}
      setActiveSwipe={setActiveSwipe}
      clearActiveSwipe={clearActiveSwipe}
      editMode={editMode}
      swipeableRef={(ref) => {
        if (ref) {
          swipeableRefs.current[item.id] = ref;
        } else {
          delete swipeableRefs.current[item.id];
        }
      }}
    >
      <View style={styles.homeworkButtonBox}>
        {item.items > 0 ? (
          <View style={styles.homeworkIndicator}>
            <Text style={styles.homeworkIndicatorText}>{item.items}</Text>
          </View>
        ) : null}
        <Pressable
          style={[styles.subjectBox, { backgroundColor: item.color }]}
          onPress={handlePress}
        >
          <Icon.FontAwesome name={item.icon} size={30} color="white" />
          <Text
            style={styles.subjectText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.subject}
          </Text>
        </Pressable>
      </View>
    </AppleStyleSwipeableRow>
  );
});

export default SubjectItem;

const styles = StyleSheet.create({
  subjectBox: {
    width: "auto",
    height: 85,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  subjectText: {
    marginLeft: 15,
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "white",
  },
  homeworkIndicator: {
    position: "absolute",
    top: 0,
    right: 6,
    borderRadius: 50,
    backgroundColor: "#FF3B30",
    minWidth: 25,
    minHeight: 25,
    paddingHorizontal: 5,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  homeworkIndicatorText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(2),
  },
  homeworkButtonBox: {
    paddingVertical: 7.5,
  },
});
