import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { firestoreDB } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  setDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const NotesInputScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!params) {
      setIsUpdating(false);
    } else {
      setIsUpdating(true);
      setTitle(params.title);
      setNote(params.note);
    }
  }, [params]);

  const addNote = async (title, note) => {
    if (user) {
      try {
        setLoading(true);

        const notesRef = doc(firestoreDB, "notes", user.uid);
        const notesSubcollectionRef = collection(notesRef, "notesList");

        await addDoc(notesSubcollectionRef, {
          title: title,
          note: note,
          timestamp: serverTimestamp(),
        });
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e,
          visibilityTime: 4000,
        });
      } finally {
        setLoading(false);
        navigation.goBack();
        navigation.navigate("NotesScreen", { refresh: true });
      }
    }
  };

  const updateNote = async (title, note) => {
    if (title === params.title && note === params.note) {
      navigation.goBack();
      return;
    }

    if (user) {
      try {
        setLoading(true);

        const notesRef = doc(firestoreDB, "notes", user.uid);
        const noteDocRef = doc(notesRef, "notesList", params.docId);

        await setDoc(
          noteDocRef,
          {
            title: title,
            note: note,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Fehler:",
          text2: e.message || "Unbekannter Fehler",
          visibilityTime: 4000,
        });
      } finally {
        setLoading(false);
        navigation.goBack();
        navigation.navigate("NotesScreen", { refresh: true });
      }
    }
  };

  useLayoutEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed
                  ? 0.4
                  : title.length >= 1 || note.length >= 1
                  ? 1
                  : 0.2,
              },
            ]}
            onPress={() =>
              isUpdating ? updateNote(title, note) : addNote(title, note)
            }
            disabled={title.length >= 1 || note.length >= 1 ? false : true}
            hitSlop={5}
          >
            <Text style={styles.saveButton}>Speichern</Text>
          </Pressable>
        ),
        headerLeft: () => (
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
            onPress={() => navigation.goBack()}
            hitSlop={5}
          >
            <Text style={styles.quitButton}>Abbrechen</Text>
          </Pressable>
        ),
      });
    }
  }, [navigation, title, note]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#EFEEF6" }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        onScroll={() => Keyboard.dismiss()}
      >
        {loading ? (
          <ActivityIndicator size={"small"} color="#333" />
        ) : (
          <View>
            <TextInput
              placeholder="Titel"
              placeholderTextColor={"lightgray"}
              value={title}
              onChangeText={setTitle}
              autoFocus
              style={{
                fontSize: 20,
                fontWeight: "bold",
                borderBottomWidth: 1,
                borderColor: "#ccc",
                marginBottom: 10,
                padding: 5,
              }}
            />
            <TextInput
              placeholder="Schreibe eine Notiz..."
              placeholderTextColor={"lightgray"}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={350}
              style={{
                height: 250,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                paddingVertical: 10,
                borderRadius: 5,
              }}
            />

            {Platform.OS === "android" ? (
              <Pressable
                style={({ pressed }) => [
                  styles.androidSaveButton,
                  {
                    opacity: pressed
                      ? 0.4
                      : title.length >= 1 || note.length >= 1
                      ? 1
                      : 0.2,
                  },
                ]}
                onPress={() =>
                  isUpdating ? updateNote(title, note) : addNote(title, note)
                }
                disabled={title.length >= 1 || note.length >= 1 ? false : true}
                hitSlop={5}
              >
                <Text style={[styles.saveButton, { color: "white" }]}>
                  Speichern
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NotesInputScreen;

const styles = StyleSheet.create({
  saveButton: {
    color: "red",
    fontSize: 17.5,
    fontWeight: "600",
  },
  quitButton: {
    color: "red",
    fontSize: 17,
    fontWeight: "400",
  },
  androidSaveButton: {
    padding: 8,
    backgroundColor: "green",
    borderRadius: 10,
    width: 130,
    height: 40,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
