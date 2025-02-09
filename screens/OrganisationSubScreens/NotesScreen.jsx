import { useLayoutEffect, useState, useCallback, useEffect } from "react";
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
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";

const NotesScreen = function ({ navigation }) {
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.deadlineResult,
        {
          shadowColor: 2 === 1 ? "#e02225" : "black",
          shadowOpacity: 2 === 1 ? 1 : 0.3,
          shadowRadius: 2 === 1 ? 9 : 4,
        },
      ]}
    >
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
          <Text style={styles.subjectText}>{item.title}</Text>
          <Text style={styles.taskText}>{item.note}</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
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
      />
    </View>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
    paddingVertical: 10,
  },
  emptyListText: {
    fontSize: 16,
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
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 16,
  },
});
