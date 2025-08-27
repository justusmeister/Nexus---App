import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import ModalHeader from "../components/AppointmentsModal/ModalHeader";
import ModalContent from "../components/AppointmentsModal/ModalContent";
import ModalButtons from "../components/AppointmentsModal/ModalButtons";
import DatePickerModal from "../components/DatePickerModal";
import { styles } from "../components/AppointmentsModal/styles";
import { eventTypesList, eventTypeColorList, eventTypeBackgroundColorList } from "../components/AppointmentsModal/constants";

const AppointmentModal = ({ visible, onClose, item, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");

  const [multiInputFocused, setMultiInputFocused] = useState(false);
  const titleRef = useRef(null);

  const [dueDate, setDueDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // States für die DatePicker Modals
  const [dueDatePickerVisible, setDueDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(item?.name || "");
      setDescription(item?.description || "");
      
      if (item?.day) {
        setDueDate(new Date(item.day));
      }
      if (item?.endDate) {
        setEndDate(new Date(item.endDate));
      } else {
        setEndDate(null);
      }
      
      if (editing) {
        setEditing(false);
      }
    }
  }, [visible, item]);

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withSpring(multiInputFocused ? 150 : 0, {
        damping: 15,
        stiffness: 100,
        mass: 1,
        easing: Easing.ease,
      }),
    };
  });

  const handleDelete = async () => {
    setLoading(true);
    const singleEvent = !item?.endDate;
    try {
      await onDelete(singleEvent, item?.id);
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaveLoading(true);
    try {
      await onUpdate(
        title,
        description,
        dueDate,
        endDate,
        item?.eventCategory,
        item?.id
      );
    } catch (error) {
      console.error("Fehler beim Update:", error);
    } finally {
      setSaveLoading(false);
      setEditing(false);
    }
  };

  const getDateWithoutTime = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => {
      titleRef?.current?.focus();
    }, 50);
  };

  const handleCancel = () => {
    setTitle(item?.name || "");
    setDescription(item?.description || "");
    if (item?.day) {
      setDueDate(new Date(item.day));
    }
    if (item?.endDate) {
      setEndDate(new Date(item.endDate));
    }
    setEditing(false);
  };

  const hasChanges = () => {
    const titleChanged = title !== (item?.name || "");
    const descriptionChanged = description !== (item?.description || "");
    const dueDateChanged = getDateWithoutTime(dueDate) !== item?.day;
    const endDateChanged = item?.eventCategory === 2 && 
      getDateWithoutTime(endDate) !== item?.endDate;
    
    return titleChanged || descriptionChanged || dueDateChanged || endDateChanged;
  };

  const handleSave = () => {
    if (hasChanges()) {
      handleUpdate();
    } else {
      handleCancel();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              <ModalHeader
                item={item}
                editing={editing}
                title={title}
                setTitle={setTitle}
                titleRef={titleRef}
                dueDate={dueDate}
                endDate={endDate}
                setDueDatePickerVisible={setDueDatePickerVisible}
                setEndDatePickerVisible={setEndDatePickerVisible}
                onClose={onClose}
                eventTypesList={eventTypesList}
                eventTypeColorList={eventTypeColorList}
                eventTypeBackgroundColorList={eventTypeBackgroundColorList}
              />
              
              <View style={styles.divider} />
              
              <ModalContent
                editing={editing}
                description={description}
                setDescription={setDescription}
                setMultiInputFocused={setMultiInputFocused}
              />
              
              <ModalButtons
                editing={editing}
                loading={loading}
                saveLoading={saveLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCancel={handleCancel}
                onSave={handleSave}
              />

              {/* DatePicker Modals */}
              <DatePickerModal
                visible={dueDatePickerVisible}
                onClose={() => setDueDatePickerVisible(false)}
                date={dueDate}
                onDateChange={setDueDate}
                title="Startdatum wählen"
                originalDate={new Date(item?.day)}
              />

              <DatePickerModal
                visible={endDatePickerVisible}
                onClose={() => setEndDatePickerVisible(false)}
                date={endDate}
                onDateChange={setEndDate}
                title="Enddatum wählen"
                originalDate={new Date(item?.endDate)}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppointmentModal;