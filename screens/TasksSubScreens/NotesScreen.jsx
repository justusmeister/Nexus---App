import { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";

const NotesScreen = function ({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const swipeableRefs = useRef({});
  const activeSwipeRef = useRef(null);
  const [editMode, setEditMode] = useState(false);

  const setActiveSwipe = (id) => {
    if (activeSwipeRef.current && activeSwipeRef.current !== id) {
      const prevRef = swipeableRefs.current[activeSwipeRef.current];
      prevRef?.close();
    }
    activeSwipeRef.current = id;
  };

  const clearActiveSwipe = (id) => {
    if (activeSwipeRef.current === id) {
      activeSwipeRef.current = null;
    }
  };

  const auth = getAuth();
  const user = auth.currentUser;

  const route = useRoute();
  const { params } = route;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchNotes();
  }, []);

  useEffect(() => {
    if (params && params.refresh !== null) {
      setLoading(true);
      fetchNotes();
    }
  }, [params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("NotesInputScreen")}
        >
          <Icon.Feather name="edit" size={30} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchNotes = async () => {
    if (user) {
      try {
        const notesRef = doc(firestoreDB, "notes", user.uid);
        const notesSubCollectionRef = collection(notesRef, "notesList");

        const q = query(notesSubCollectionRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);

        const fetchedNotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotesList(fetchedNotes);
      } catch (error) {
        console.error("Fehler beim Abrufen der Hausaufgabenliste:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteNote = async (id) => {
    if (user) {
      try {
        const noteRef = doc(firestoreDB, "notes", user.uid, "notesList", id);

        await deleteDoc(noteRef);
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: "Beim Löschen der Notiz ist ein Fehler aufgetreten.",
          visibilityTime: 4000,
        });
        console.error("Fehler beim Löschen der Notiz:", e);
      } finally {
        fetchNotes();
      }
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <AppleStyleSwipeableRow
        onPressDelete={() => deleteNote(item.id)}
        id={item.id}
        setActiveSwipe={setActiveSwipe}
        clearActiveSwipe={clearActiveSwipe}
        editMode={editMode}
        swipeableRef={(ref) => (swipeableRefs.current[item.id] = ref)}
      >
        <View style={styles.deadlineResult}>
          <Pressable
            onPress={() => {
              navigation.navigate("NotesInputScreen", {
                title: item.title,
                note: item.note,
                docId: item.id,
              });
            }}
            style={styles.deadlineTaskBox}
          >
            <View style={styles.deadlineDetails}>
              <Text
                style={styles.subjectText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text
                style={styles.taskText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.note}
              </Text>
            </View>
          </Pressable>
        </View>
      </AppleStyleSwipeableRow>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <FlatList
        data={notesList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : notesList.length < 1 ? (
            <Text style={styles.emptyListText}>
              Keine Hausaufgaben vorhanden
            </Text>
          ) : null
        }
        ListHeaderComponent={
          loading ? null : notesList.length < 1 ? null : (
            <View style={styles.editBox}>
              <Pressable
                onPress={() => {
                  setEditMode((prev) => !prev);
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.4 : 1,
                  },
                ]}
                hitSlop={30}
              >
                <Icon.Feather
                  name="edit-2"
                  size={26}
                  color={"black"}
                />
              </Pressable>
            </View>
          )
        }
        style={{ padding: 8 }}
      />
    </View>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  emptyListText: {
    fontSize: RFPercentage(2.05),
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    marginRight: 15,
  },
  deadlineResult: {
    width: "auto",
    marginVertical: 6,
  },
  deadlineTaskBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#d1a336",
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subjectText: {
    color: "#333",
    fontSize: RFPercentage(2.18),
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    color: "#333",
    fontSize: RFPercentage(1.92),
    marginBottom: 16,
  },
  editBox: {
    alignItems: "flex-end",
    marginRight: 14,
    margin: 3,
  },
});
