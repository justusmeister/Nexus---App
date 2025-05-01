import { useCallback, useMemo, useState, memo } from "react";
import { Pressable, Text, FlatList, StyleSheet } from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import * as Icon from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";
import SaveButton from "../../General/SaveButton";
import { icons, colors } from "./selectableTypesList";
import FormField from "../../General/FormField";

const AddSubjectBottomSheet = memo(function ({
  sheetRef,
  titleInputRef,
  addSubject,
}) {
  const [subjectName, setSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);

  const snapPoints = useMemo(() => ["60%"], []);

  const handleClose = () => {
    sheetRef.current?.dismiss();
  };

  const handleSave = () => {
    if (subjectName.trim()) {
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
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleDismiss = () => {
    setSubjectName("");
    setSelectedColor(colors[0]);
    setSelectedIcon(icons[0]);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <FormField
          label="Name des Faches:"
          value={subjectName}
          setValue={setSubjectName}
          placeholder="Name des Faches"
          maxLength={40}
          inputRef={titleInputRef}
        />
        <Text style={[styles.label, { marginTop: 8 }]}>Farbe auswählen:</Text>
        <FlatList
          horizontal
          data={colors}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.colorChoosingBox,
                {
                  opacity: pressed ? 0.6 : 1,
                  backgroundColor: item,
                  borderWidth: item === selectedColor ? 2 : 0,
                },
              ]}
              onPress={() => setSelectedColor(item)}
            />
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsHorizontalScrollIndicator={false}
        />
        <Text style={[styles.label, { marginTop: 20 }]}>Icon auswählen:</Text>
        <FlatList
          horizontal
          data={icons}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.iconChoosingBox,
                {
                  opacity: pressed ? 0.6 : 1,
                  borderWidth: item === selectedIcon ? 2 : 0,
                  backgroundColor:
                    item === selectedIcon ? "#e8e8e8" : "#f7f5f5",
                },
              ]}
              onPress={() => setSelectedIcon(item)}
            >
              <Icon.FontAwesome
                name={item}
                size={28}
                color={item === selectedIcon ? "black" : "#b0b0b0"}
              />
            </Pressable>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsHorizontalScrollIndicator={false}
        />
        <SaveButton onPress={handleSave} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default AddSubjectBottomSheet;

const styles = StyleSheet.create({
  label: {
    fontSize: RFPercentage(2.18),
    fontWeight: "500",
    marginBottom: 8,
  },
  colorChoosingBox: {
    borderColor: "black",
    width: 48,
    height: 48,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  iconChoosingBox: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    width: 48,
    height: 48,
    marginHorizontal: 8,
    borderRadius: 12,
    borderColor: "black",
    marginBottom: 20,
  },
  scrollView: {
    padding: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});
