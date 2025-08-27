import React from "react";
import { StyleSheet, Pressable } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

const FilterDropDownMenu = ({
  onFilterNone,
  onFilterHolidays,
  onFilterEvents,
  filter,
}) => {
  const { colors } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Pressable
          style={({ pressed }) => [
            styles.filterButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={12}
        >
          <Icon
            name={filter === 0 ? "filter-list-off" : "filter-list"}
            size={30}
            color={colors.text}
          />
        </Pressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>Wähle einen Filter</DropdownMenu.Label>
        <DropdownMenu.Item key="1" onSelect={onFilterNone}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "xmark",
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Kein Filter</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="2" onSelect={onFilterHolidays}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "beach.umbrella",
              pointSize: 18,
            }}
          />
          <DropdownMenu.ItemTitle>Ferien</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Item key="3" onSelect={onFilterEvents}>
          <DropdownMenu.ItemIcon
            ios={{
              name: "calendar",
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
    padding: 6,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
