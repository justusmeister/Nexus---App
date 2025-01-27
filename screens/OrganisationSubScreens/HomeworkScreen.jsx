import { useCallback, useEffect, useRef, useState } from "react";
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
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
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

  const snapPoints = ["70%"];

  const handleOpen = () => {
    sheetRef.current?.snapToIndex(1);
  };

  const handleClose = () => {
    sheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
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
            width: "100%",
            height: 50,
            marginVertical: 18,
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "white",
              marginLeft: 10,
              textTransform: "capitalize",
            }}
          >
            Fach hinzufügen
          </Text>
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

      <View style={{ paddingBottom: 79 }}>
        <Pressable
          style={{
            width: "100%",
            height: 85,
            marginTop: 20,
            backgroundColor: "#d1a336",
            borderRadius: 20,
            padding: 15,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
          onPress={() =>
            navigation.navigate("GenericScreen", {
              subject: "allgemeine Notizen",
            })
          }
        >
          <Icon.FontAwesome6 name="note-sticky" size={30} color="white" />
          <Text
            style={{
              marginLeft: 15,
              fontSize: 18,
              fontWeight: "600",
              color: "white",
            }}
          >
            Allgemeine Notizen
          </Text>
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
              <Pressable
                style={[styles.subjectBox, { backgroundColor: item.color }]}
                onPress={() =>
                  navigation.navigate("GenericScreen", {
                    subject: item.subject,
                  })
                }
              >
                <Icon.FontAwesome name={item.icon} size={30} color="white" />
                <Text style={styles.subjectText}>{item.subject}</Text>
              </Pressable>
            )
          }
          ListFooterComponent={listFooterBox}
          ListHeaderComponent={() => {
            if (subjects.length < 1 && !loading) {
              return (
                <View style={{ alignItems: "center", rowGap: 10, margin: 10 }}>
                  <Text
                    style={{
                      fontSize: 16,
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
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          if (index === 0) {
            sheetRef.current?.close();
          }
        }}
      >
        <BottomSheetView style={{ padding: 16, marginBottom: 79 }}>
          <Text style={[styles.label, { marginBottom: 12 }]}>
            Name des Faches:
          </Text>
          <TextInput
            style={[
              styles.subjectInputfield,
              {
                height: 50,
                borderColor: "#d1d1d6",
                borderWidth: 1,
                borderRadius: 12,
                backgroundColor: "#f9f9f9",
                paddingHorizontal: 16,
                fontSize: 16,
                color: "#333",
              },
            ]}
            placeholder="Name des Fachs"
            placeholderTextColor="#b0b0b0"
            value={subjectName}
            onChangeText={setSubjectName}
          />
          <Text style={[styles.label, { marginTop: 20, marginBottom: 12 }]}>
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
          <Text style={[styles.label, { marginTop: 20, marginBottom: 12 }]}>
            Icon auswählen:
          </Text>
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
                backgroundColor: "#0066cc",
                height: 50,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
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
            <Text style={[styles.buttonText, { fontSize: 16 }]}>Speichern</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 14,
    backgroundColor: "#EFEEF6",
  },
  subjectBox: {
    width: "100%",
    height: 85,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  subjectText: {
    marginLeft: 15,
    fontSize: 18,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
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
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
