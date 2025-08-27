import React, { useState, memo, useRef, useMemo, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, LayoutAnimation } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PlusButton from "../../components/General/PlusButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import TodoItem from "../../components/Todo/TodoItem";
import TodoBottomSheet from "../../components/BottomSheets/TodoBottomSheet/TodoBottomSheet";
import { useTodos } from "../../hooks/useTodos";
import { getAuth } from "firebase/auth";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "@react-navigation/native";

const TodosScreen = () => {
  const { colors, fonts } = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const segmentedValues = ["Dringend", "Demnächst", "Optional"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { todoList, loading, fetchTodos, addTodo, deleteTodo } = useTodos(user);

  const handleDeleteTodo = (id) => {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteTodo(id);
  };

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const filteredTodos = useMemo(() => {
    const selectedType = segmentedValues[selectedIndex];
    return todoList.filter((todo) => todo.type === selectedType);
  }, [selectedIndex, todoList]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.segmentedControlBox}>
        <SegmentedControl
          values={segmentedValues}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          style={{ height: 32, width: "100%" }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Animated.View
          key={selectedIndex}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.listContainer}
        >
          <FlashList
            data={filteredTodos}
            estimatedItemSize={60}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TodoItem
                item={item}
                index={index}
                //onPress={(id) => console.log("Todo pressed:", id)}
                onDelete={handleDeleteTodo}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>Alle Todos erledigt</Text>
            }
            style={styles.listStyle}
          />
        </Animated.View>
      )}

      <View style={[styles.buttonWrapper, { bottom: bottomTabBarHeight + 5 }]}>
        <PlusButton onPress={handleOpen} />
      </View>
      <TodoBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
        addTodo={addTodo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EFEEF6",
  },
  segmentedControlBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingVertical: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  todoItem: {
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  todoText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dueDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  buttonWrapper: {
    position: "absolute",
    right: 20,
    alignItems: "center",
    width: 100,
    height: 100,
  },
  emptyListText: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  listStyle: {},
});

export default memo(TodosScreen);
