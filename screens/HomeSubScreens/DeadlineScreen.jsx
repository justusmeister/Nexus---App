import React, { useState, useEffect } from "react";
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ScrollView, 
  Text, 
  ActivityIndicator
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDeadlinesData } from "../../contexts/DeadlinesContext";
import DeadlineItem from "../../components/Deadline/DeadlineItem";
import DeadlineInformationModal from "../../modals/DeadlineInformationModal";

const DeadlineScreen = function () {
  const tabBarHeight = useBottomTabBarHeight();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { deadlinesData, deleteDeadline } = useDeadlinesData();
  const route = useRoute();

  // Get task ID from route params if available
  let index = route.params?.taskId !== null ? route.params?.taskId : null;

  useEffect(() => {
    if (index !== null && index !== undefined && deadlinesData[0] !== "loading") {
      const task = deadlinesData[index];
      setTimeout(() => {
        setCurrentTask(task);
        setIsModalVisible(true);
      }, 300);
    }
  }, [index, deadlinesData]);

  if (deadlinesData[0] === "loading") {
    return (
      <ScrollView contentContainerStyle={{ padding: 15, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#333" />
      </ScrollView>
    );
  }

  const handleOpenModal = (task) => {
    setCurrentTask(task);
    setIsModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6", paddingBottom: tabBarHeight + 6 }}>
      <FlatList
        data={deadlinesData}
        renderItem={({ item, index }) => (
          <DeadlineItem 
            item={item} 
            index={index} 
            onPress={() => handleOpenModal(item)}
            onDelete={deleteDeadline}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 8 }}
        ListEmptyComponent={
          <ScrollView
            contentContainerStyle={{ padding: 15, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: RFPercentage(2.05),
                fontWeight: "500",
                color: "#8E8E93",
              }}
            >
              Alle Fristen erledigt! 💪
            </Text>
          </ScrollView>
        }
      />
      
      <DeadlineInformationModal
        visible={isModalVisible}
        task={currentTask}
        onClose={() => setIsModalVisible(false)}
        onConfirm={deleteDeadline}
      />
    </View>
  );
};

export default DeadlineScreen;