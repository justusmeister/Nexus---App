import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import * as Icon from "@expo/vector-icons";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import FormalSignleLineInputField from "../../components/FormalSingleLineInputField";

const colors = [
  "#333",
  "#808080",
  "#3872cf",
  "#f39c12",
  "#27ae60",
  "#8e44ad",
  "#e74c3c",
];
const icons = [
  "book",
  "calculator",
  "flask",
  "globe",
  "paint-brush",
  "music",
  "code",
];

const HomeworkScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();

  const sheetRef = useRef(null);

  const [subjectName, setSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);

  const [loading, setLoading] = useState(true);

  const [subjects, setSubjects] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    if (user) {
      try {
        const subjectRef = collection(firestoreDB, "subjects");
        const q = query(
          subjectRef,
          where("userId", "==", user.uid),
          orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);

        const fetchedSubjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Fehler beim Abrufen der Fächer:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addSubject = async (subject, color, icon) => {
    if (user) {
      try {
        setLoading(true);
        await setDoc(doc(firestoreDB, "subjects", user.uid + subject), {
          subject: subject,
          color: color,
          icon: icon,
          timestamp: serverTimestamp(),
          userId: user.uid,
        });
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e,
          visibilityTime: 4000,
        });
      } finally {
        fetchSubjects();
      }
    }
  };

  const deleteSubject = async (subject) => {
    if (user) {
      try {
        const subjectRef = doc(firestoreDB, "subjects", user.uid + subject);
        await deleteDoc(subjectRef);

        setSubjects((prevSubjects) =>
          prevSubjects.filter((item) => item.subject !== subject)
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen des Fachs ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen des Fachs:", e);
      }
    }
  };

  const snapPoints = useMemo(() => ["60%"], []);

  const handleOpen = () => {
    sheetRef.current?.present();
  };

  const handleClose = () => {
    sheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const listFooterBox = () => (
    <View>
      <View>
        <TouchableOpacity
          style={{
            width: "auto",
            height: 50,
            margin: 20,
            flexDirection: "row",
            backgroundColor: "#0066cc",
            borderRadius: 30,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            opacity: 0.9,
          }}
          activeOpacity={0.4}
          onPress={() => {
            handleOpen();
            setSubjectName("");
            setSelectedColor(colors[0]);
            setSelectedIcon(icons[0]);
          }}
        >
          <Icon.Feather name="plus-square" size={26} color="white" />
          <Text style={styles.subjectText}>Fach hinzufügen</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginTop: 7.5 }}>
        <View
          style={{
            width: "95%",
            borderTopColor: "grey",
            borderTopWidth: 1,
            borderRadius: 15,
          }}
        />
      </View>

      <View style={{ paddingBottom: tabBarHeight - 11 }}>
        <Pressable
          style={{
            width: "auto",
            height: 85,
            marginTop: 20,
            backgroundColor: "#d1a336",
            borderRadius: 20,
            padding: 15,
            marginHorizontal: 14,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
          onPress={() => navigation.navigate("NotesScreen")}
        >
          <Icon.FontAwesome6 name="note-sticky" size={30} color="white" />
          <Text style={styles.noteButtonText}>allgemeine Notizen</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <View style={styles.screen}>
        <FlatList
          data={loading ? [...subjects, { id: "loading-indicator" }] : subjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            item.id === "loading-indicator" ? (
              <ActivityIndicator
                size="small"
                color="#333"
                style={{ marginVertical: 20, alignSelf: "center" }}
              />
            ) : (
              <AppleStyleSwipeableRow
                onPressDelete={() =>
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
                  )
                }
              >
                <Pressable
                  style={[styles.subjectBox, { backgroundColor: item.color }]}
                  onPress={() =>
                    navigation.navigate("GenericScreen", {
                      subject: item.subject,
                      color: item.color,
                    })
                  }
                >
                  <Icon.FontAwesome name={item.icon} size={30} color="white" />
                  <Text style={styles.subjectText}>{item.subject}</Text>
                </Pressable>
              </AppleStyleSwipeableRow>
            )
          }
          ListFooterComponent={listFooterBox}
          ListHeaderComponent={() => {
            if (subjects.length < 1 && !loading) {
              return (
                <View style={{ alignItems: "center", rowGap: 10, margin: 10 }}>
                  <Text
                    style={{
                      fontSize: RFPercentage(2.05),
                      fontWeight: "600",
                      color: "#8E8E93",
                    }}
                  >
                    Noch keine Fächer hinzugefügt
                  </Text>
                  <Icon.Feather
                    name="arrow-down-circle"
                    size={30}
                    color="#8E8E93"
                  />
                </View>
              );
            }
            return null;
          }}
          style={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        keyboardBehavior="interactive"
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{ padding: 16 }}>
          <Text style={styles.label}>Name des Faches:</Text>
          <TextInput
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              fontSize: RFPercentage(2.18),
            }}
            placeholder="Name des Fachs"
            value={subjectName}
            onChangeText={setSubjectName}
            autoOpen={true}
          />
          <Text style={[styles.label, { marginTop: 20 }]}>
            Farbe auswählen:
          </Text>
          <FlatList
            horizontal
            data={colors}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorChoosingBox,
                  {
                    backgroundColor: item,
                    borderWidth: item === selectedColor ? 2 : 0,
                    borderColor: "black",
                    width: 48,
                    height: 48,
                    marginHorizontal: 8,
                    borderRadius: 12,
                  },
                ]}
                onPress={() => setSelectedColor(item)}
              />
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={[styles.label, { marginTop: 20 }]}>Icon auswählen:</Text>
          <FlatList
            horizontal
            data={icons}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconChoosingBox,
                  {
                    width: 48,
                    height: 48,
                    marginHorizontal: 8,
                    borderRadius: 12,
                    borderWidth: item === selectedIcon ? 2 : 0,
                    borderColor: "black",
                    backgroundColor:
                      item === selectedIcon ? "#e8e8e8" : "#f9f9f9",
                  },
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Icon.FontAwesome
                  name={item}
                  size={28}
                  color={item === selectedIcon ? "black" : "#b0b0b0"}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            showsHorizontalScrollIndicator={false}
          />
          <Pressable
            style={[
              styles.confirmButton,
              {
                marginTop: 30,
              },
            ]}
            onPress={() => {
              if (subjectName !== "") {
                addSubject(subjectName.trim(), selectedColor, selectedIcon);
                handleClose();
              } else {
                Toast.show({
                  type: "error",
                  text1: "Fehler beim Hinzufügen! ❗",
                  text2: "Das Fach muss einen Namen haben!",
                  visibilityTime: 4000,
                });
              }
            }}
          >
            <Text style={[styles.buttonText, { fontSize: RFPercentage(2.18) }]}>
              Speichern
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  subjectBox: {
    width: "auto",
    height: 85,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  subjectText: {
    marginLeft: 15,
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "white",
  },
  addSubjectButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0066cc",
    borderRadius: 30,
    height: 55,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  addSubjectText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(2.05),
    marginLeft: 10,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  subjectInputfield: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    marginBottom: 8,
  },
  colorChoosingBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  iconChoosingBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#0066cc",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  noteButtonText: {
    marginLeft: 15,
    fontSize: RFPercentage(2.31),
    fontWeight: "600",
    color: "white",
  },
});
