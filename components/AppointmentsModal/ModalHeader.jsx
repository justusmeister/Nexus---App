import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Pressable,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { styles } from "./styles";
import { formatDate } from "./utils";

const ModalHeader = ({
  item,
  editing,
  title,
  setTitle,
  titleRef,
  dueDate,
  endDate,
  setDueDatePickerVisible,
  setEndDatePickerVisible,
  onClose,
  eventTypesList,
  eventTypeColorList,
  eventTypeBackgroundColorList,
}) => {
  return (
    <>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon.Feather name="x-circle" size={30} color="#333" />
      </TouchableOpacity>
      
      <View
        style={[
          styles.modalHeader,
          {
            backgroundColor: eventTypeBackgroundColorList[item?.eventType],
          },
        ]}
      >
        <TextInput
          ref={titleRef}
          editable={editing}
          style={[
            styles.title,
            styles.inputStyle,
            editing && styles.underlineInput,
            editing && { paddingVertical: 6 },
            { color: eventTypeColorList[item?.eventType] },
          ]}
          value={title}
          onChangeText={setTitle}
          maxLength={40}
        />

        <Text style={styles.remainingTimeText}>
          {eventTypesList[item?.eventType]}
        </Text>
        
        {!editing ? (
          <Text style={styles.motivationText}>
            Datum: {formatDate(dueDate)}
            {item?.eventCategory === 2 ? ` - ${formatDate(endDate)}` : null}
          </Text>
        ) : (
          <View style={styles.datePickerBox}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Datum: </Text>
              <Pressable
                onPress={() => setDueDatePickerVisible(true)}
                style={styles.dateButton}
                hitSlop={10}
              >
                <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
              </Pressable>
              {item?.eventCategory === 2 && (
                <>
                  <Text style={styles.dateText}> - </Text>
                  <Pressable
                    onPress={() => setEndDatePickerVisible(true)}
                    style={styles.dateButton}
                    hitSlop={10}
                  >
                    <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default ModalHeader;