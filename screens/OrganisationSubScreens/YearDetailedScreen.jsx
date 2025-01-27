import { useLayoutEffect, useRef, useCallback, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as Icon from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { SegmentedControl } from "../../components/SegmentedControl";

const YearDetailedScreen = function ({ navigation }) {
  const [selectedOption, setSelectedOption] = useState("Event");

  const route = useRoute();
  const { params } = route;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: params?.month,
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={handleOpen}>
          <Icon.AntDesign name="pluscircle" size={35} color="#3a5f8a" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const sheetRef = useRef(null);

  const snapPoints = ["50%", "80%"];

  const handleOpen = () => {
    sheetRef.current?.snapToIndex(2);
  };

  const handleClose = () => {
    sheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={0}
        {...props}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.monthOverviewContainer}></View>
        <View style={styles.deadlineListView}></View>
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
        <BottomSheetView style={styles.sheetContainer}>
          <SegmentedControl
            options={["Zeitraum", "Event", "Frist"]}
            selectedOption={selectedOption}
            onOptionPress={setSelectedOption}
          />
          <Text style={styles.label}>Name des Faches:</Text>
          <TextInput
            style={styles.subjectInputfield}
            placeholder="Name des Fachs"
          />
          <Pressable style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Speichern</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default YearDetailedScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a1a1a1",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a1a1a1",
  },
  monthOverviewContainer: {
    flex: 1,
  },
  deadlineListView: {
    height: "50%",
    widht: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
  },
  sheetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 79,
  },
});
