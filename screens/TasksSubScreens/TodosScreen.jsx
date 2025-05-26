import React, { useState, memo, useRef, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PlusButton from "../../components/General/PlusButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import TodoItem from "../../components/Todo/TodoItem";
import TodoBottomSheet from "../../components/BottomSheets/TodoBottomSheet/TodoBottomSheet";

const exampleTodos = [
  {
    id: "1",
    typ: "Dringend",
    todo: "Mathearbeit lernen",
    dueDate: "2025-06-01",
    priorität: 2,
    attachments: [],
  },
  {
    id: "2",
    typ: "Demnächst",
    todo: "Buch abgeben",
    dueDate: "2025-06-05",
    priorität: 1,
    attachments: [],
  },
  {
    id: "3",
    typ: "Optional",
    todo: "Ordner sortieren",
    dueDate: null,
    priorität: 0,
    attachments: [],
  },
  {
    id: "4",
    typ: "Dringend",
    todo: "Elternzettel unterschreiben",
    dueDate: "2025-05-25",
    priorität: 2,
    attachments: [],
  },
  {
    id: "5",
    typ: "Demnächst",
    todo: "Facharbeit formatieren",
    dueDate: null,
    priorität: 1,
    attachments: ["karste.png"],
  },
];

const TodosScreen = () => {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const segmentedValues = ["Dringend", "Demnächst", "Optional"];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);

  const handleOpen = () => {
    sheetRef.current?.present();
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);
  };

  const filteredTodos = useMemo(() => {
    const selectedType = segmentedValues[selectedIndex];
    return exampleTodos.filter((todo) => todo.typ === selectedType);
  }, [selectedIndex]);

  const handleAddTodo = () => {
    console.log("Add todo");
  };

  return (
    <View style={styles.screen}>
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
              onPress={() => console.log("Todo pressed:", item.todo)}
              onDelete={(id) => console.log("Delete todo with id:", id)}
            />
          )}
          style={styles.listStyle}
        />
      </Animated.View>

      <View style={[styles.buttonWrapper, { bottom: bottomTabBarHeight + 5 }]}>
        <PlusButton onPress={handleOpen} />
      </View>
      <TodoBottomSheet
        sheetRef={sheetRef}
        titleInputRef={titleInputRef}
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
  listStyle: {},
});

export default memo(TodosScreen);
