import { useRef, useCallback, useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import AddSubjectBottomSheet from "../../components/BottomSheets/AddSubjectBottomSheet/AddSubjectBottomSheet";
import SubjectItem from "../../components/Homework/SubjectItem";
import SubjectListFooterComponent from "../../components/Homework/SubjectListFooterComponent";
import SubjectListHeaderComponent from "../../components/Homework/SubjectListHeaderComponent";
import { useSubjects } from "../../hooks/useSubjects";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import FadeInTab from "../../components/General/FadeInTab";

const HomeworkScreen = () => {
  const { colors, fonts } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const swipeableRefs = useRef({});
  const activeSwipeRef = useRef(null);

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { subjects, loading, addSubject, deleteSubject } = useSubjects(user);

  const setActiveSwipe = useCallback((id) => {
    if (!editMode) {                 
      if (activeSwipeRef.current && activeSwipeRef.current !== id) {
        swipeableRefs.current[activeSwipeRef.current]?.close();
      }
      activeSwipeRef.current = id;
    }
  }, [editMode]);
  
  useFocusEffect(
    useCallback(() => {
      return () => {
        setEditMode(false);
      };
    }, [])
  );

  const clearActiveSwipe = useCallback((id) => {
    if (activeSwipeRef.current === id) {
      activeSwipeRef.current = null;
    }
  }, []);

  const toggleEditMode = () => { setEditMode((prev) => !prev); };   

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  return (
    <FadeInTab>
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
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
            editMode={editMode}
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
    </FadeInTab>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flatList: {
    paddingVertical: 8,
  },
});
