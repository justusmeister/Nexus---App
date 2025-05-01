import { useRef, useCallback, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import AddSubjectBottomSheet from "../../components/BottomSheets/AddSubjectBottomSheet/AddSubjectBottomSheet";
import SubjectItem from "../../components/Homework/SubjectItem";
import SubjectListFooterComponent from "../../components/Homework/SubjectListFooterComponent";
import SubjectListHeaderComponent from "../../components/Homework/SubjectListHeaderComponent";
import { useSubjects } from "../../hooks/useSubjects";

const HomeworkScreen = () => {
  const [editMode, setEditMode] = useState(false);
  const swipeableRefs = useRef({});
  const activeSwipeRef = useRef(null);

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { subjects, loading, addSubject, deleteSubject } = useSubjects(user);

  const setActiveSwipe = useCallback((id) => {
    if (activeSwipeRef.current && activeSwipeRef.current !== id) {
      const prevRef = swipeableRefs.current[activeSwipeRef.current];
      prevRef?.close();
    }
    activeSwipeRef.current = id;
  }, []);

  const clearActiveSwipe = useCallback((id) => {
    if (activeSwipeRef.current === id) {
      activeSwipeRef.current = null;
    }
  }, []);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={loading ? [...subjects, { id: "loading-indicator" }] : subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SubjectItem
            item={item}
            editMode={editMode}
            swipeableRefs={swipeableRefs}
            activeSwipeRef={activeSwipeRef}
            setActiveSwipe={setActiveSwipe}
            clearActiveSwipe={clearActiveSwipe}
            deleteSubject={deleteSubject}
          />
        )}
        ListFooterComponent={() => (
          <SubjectListFooterComponent handleOpen={handleOpen} />
        )}
        ListHeaderComponent={() => (
          <SubjectListHeaderComponent
            subjectsLength={subjects.length}
            loading={loading}
            toggleEditMode={toggleEditMode}
          />
        )}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
      />
      <AddSubjectBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
        addSubject={addSubject}
      />
    </View>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  flatList: {
    paddingVertical: 8,
  },
});
