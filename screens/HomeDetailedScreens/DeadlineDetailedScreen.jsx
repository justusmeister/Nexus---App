import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Checkbox from "../../components/Checkbox";
import { useDeadlinesData } from "../../contexts/DeadlinesDataContext";

const DeadlineDetailedScreen = function () {
  const { deadlinesData, changeData } = useDeadlinesData();

  const renderDeadline = ({ item, index }) => (
    <View style={styles.deadlineResult}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
            {item.subject}:
          </Text>

          <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }}>
            {item.task}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "#363636",
            }}
          >
            {item.dueDate}
          </Text>
        </View>
        <Checkbox
          onConfirm={() => {
            if (deadlinesData.length > 1) {
              const updatedDeadlines = deadlinesData.filter(
                (_, index) => index !== place
              );
              changeData(updatedDeadlines);
            } else {
              changeData([]);
            }
          }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={deadlinesData}
      renderItem={renderDeadline}
      keyExtractor={(item, index) => index.toString()}
      style={{ padding: 8 }}
    />
  );
};

const styles = StyleSheet.create({
  deadlineResult: {
    width: "100%",
    height: 100,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    padding: 8,
    backgroundColor: "#e02225",
  },
});

export default DeadlineDetailedScreen;
