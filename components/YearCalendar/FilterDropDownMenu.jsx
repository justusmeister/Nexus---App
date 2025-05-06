import React from "react";
import { StyleSheet, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import Icon from "react-native-vector-icons/MaterialIcons";

const FilterDropDownMenu = ({
  onFilterNone,
  onFilterHolidays,
  onFilterEvents,
  filter,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={styles.filterButton}>
          <Icon
            name={filter === 0 ? "filter-list-off" : "filter-list"}
            size={30}
            color="#333"
          />
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>Wähle einen Filter</DropdownMenu.Label>
        <DropdownMenu.Item key="1" onSelect={onFilterNone}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "xmark", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Kein Filter</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="2" onSelect={onFilterHolidays}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "beach.umbrella", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Ferien</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="3" onSelect={onFilterEvents}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "calendar", // required
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Termine</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FilterDropDownMenu;

const styles = StyleSheet.create({
  filterButton: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: "#d1d1d1",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
