import React from "react";
import { StyleSheet, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import Icon from "react-native-vector-icons/Feather";

const AddAttachmentDropDownMenu = ({
  onCamera,
  onImages,
  onFiles,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={styles.filterButton}>
          <Icon
            name="plus"
            size={30}
            color="#333"
          />
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="1" onSelect={onCamera}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "camera", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Kamera</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="2" onSelect={onImages}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "photo", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Bilder</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="3" onSelect={onFiles}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "folder", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Dateien</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default AddAttachmentDropDownMenu;

const styles = StyleSheet.create({
  filterButton: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
