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
import { useRoute, useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";

const NotesInputScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const { colors, fonts } = useTheme();

  const route = useRoute();
  const { params } = route;

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!params || params?.fastNotes == true) {
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
        if (!params?.fastNotes)
          navigation.navigate("Tabs", {
            screen: "Tasks",
            params: {
              screen: "NotesScreen",
              params: { refresh: true },
            },
          });
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
        if (!params?.fastNotes)
          navigation.navigate("Tabs", {
            screen: "Tasks",
            params: {
              screen: "NotesScreen",
              params: { refresh: true },
            },
          });
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
                  : 0.4,
              },
            ]}
            onPress={() =>
              isUpdating ? updateNote(title, note) : addNote(title, note)
            }
            disabled={title.length >= 1 || note.length >= 1 ? false : true}
            hitSlop={5}
          >
            <Text style={[styles.saveButton, { color: colors.primary, fontFamily: fonts.bold }]}>Speichern</Text>
          </Pressable>
        ),
        headerLeft: () => (
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.4 : 1 }]}
            onPress={() => navigation.goBack()}
            hitSlop={5}
          >
            <Text style={[styles.quitButton, { color: colors.warning, fontFamily: fonts.regular }]}>Abbrechen</Text>
          </Pressable>
        ),
      });
    }
  }, [navigation, title, note]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background, marginTop: 5, 
        borderTopColor: colors.border,
        borderTopWidth: StyleSheet.hairlineWidth,  }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        onScroll={() => Keyboard.dismiss()}
      >
        {loading ? (
          <ActivityIndicator size={"small"} color={colors.text} />
        ) : (
          <View>
            <TextInput
              placeholder="Titel"
              placeholderTextColor={colors.text + "99"}
              value={title}
              onChangeText={setTitle}
              autoFocus
              style={{
                fontSize: RFPercentage(2.69),
                color: colors.text,
                fontFamily: fonts.semibold,
                borderBottomWidth: 1,
                borderColor: colors.border,
                marginBottom: 10,
                padding: 5,
              }}
            />
            <TextInput
              placeholder="Schreibe eine Notiz..."
              placeholderTextColor={colors.text + "99"}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={350}
              style={{
                height: 250,
                textAlignVertical: "top",
                color: colors.text,
                fontFamily: fonts.semibold,
                borderWidth: 1,
                borderColor: colors.border,
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
                    backgroundColor: colors.primary
                  },
                ]}
                onPress={() =>
                  isUpdating ? updateNote(title, note) : addNote(title, note)
                }
                disabled={title.length >= 1 || note.length >= 1 ? false : true}
                hitSlop={5}
              >
                <Text style={[styles.saveButton, { color: colors.text, fontFamily: fonts.semibold }]}>
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
    fontSize: RFPercentage(2.375),
  },
  quitButton: {
    fontSize: RFPercentage(2.31),
  },
  androidSaveButton: {
    padding: 8,
    borderRadius: 10,
    width: 130,
    height: 40,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
