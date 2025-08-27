import { memo } from "react";
import { StyleSheet, View, Text, Pressable, Animated } from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";
import { checkDeadlineRemainingTime } from "../../utils/checkDeadlineRemainingTime";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { formatDueDateFromTimestamp } from "../../utils/formatDueDate";
import { useTheme } from "@react-navigation/native";

const GenericSubjectItem = memo(function ({
  item,
  index,
  color,
  handleOpenDetailedModal,
  updateHomeworkStatus,
  activeAnimation,
  setActiveAnimation,
  buttonScale,
}) {
  const { colors, fonts } = useTheme();

  const handlePressIn = () => {
    setActiveAnimation(index);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
    }).start(() => {
      setActiveAnimation(null);
    });
  };

  const dueDateFormatted = formatTimestamp(item.dueDate);
  const deadlineInfo = checkDeadlineRemainingTime(dueDateFormatted);
  const isOverDue = deadlineInfo.isWithinTwoDays === 0 && !item.status;
  const isUrgent = deadlineInfo.isWithinTwoDays === 1 && !item.status;

  const shadowStyle = {
    shadowColor: isUrgent ? "#e02225" : "#000",
    shadowOpacity: isUrgent ? 0.8 : 0.1,
    shadowRadius: isUrgent ? 7 : 4,
  };

  const iconName = item.status ? "check" : isOverDue ? "times" : "dot-circle-o";

  const iconColor = item.status ? "#3FCF63" : isOverDue ? "#F44336" : "#A0A0A5";

  const iconBgColor = item.status
    ? "#D2F8D2"
    : isOverDue
    ? "#FDDCDC"
    : "#E4E4E7";

    const formattedDueDate = formatDueDateFromTimestamp(item.dueDate);

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              scale: activeAnimation === index ? buttonScale : 1,
            },
          ],
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.deadlineResult, shadowStyle]}
        onPress={() => handleOpenDetailedModal(item)}
        onLongPress={() => !item.status && updateHomeworkStatus(item.id)}
      >
        <View
          style={[
            styles.deadlineTaskBox,
            {
              borderLeftColor: color,
              backgroundColor: "#ffffff",
            },
          ]}
        >
          <View
            style={[styles.statusIconBox, { backgroundColor: iconBgColor }]}
          >
            <Icon.FontAwesome name={iconName} size={28} color={iconColor} />
          </View>

          <View style={styles.deadlineDetails}>
            <Text
              style={styles.subjectText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}:
            </Text>
            <Text
              style={styles.taskText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
            <Text
              style={[
                styles.dueDateText,
                { color: isUrgent ? "#e02225" : "grey" },
              ]}
            >
              <Text style={styles.dueDateDescriptionText}>Abgabe: </Text>
              {formattedDueDate}
            </Text>
          </View>
          {item.attachments && (
            <Icon.Feather
              name="paperclip"
              size={20}
              color="black"
              style={styles.attachmentsIcon}
            />
          )}
          {item.priority > 0 && (
            <Icon.FontAwesome name="exclamation" size={27} color={colors.warning} />
          )}
          {item.priority > 1 && (
            <Icon.FontAwesome name="exclamation" size={27} color={colors.warning} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default GenericSubjectItem;

const styles = StyleSheet.create({
  deadlineResult: {
    width: "auto",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  deadlineTaskBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E4E4E7",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
  },
  deadlineDetails: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 15,
  },
  subjectText: {
    color: "#333",
    fontSize: RFPercentage(2.18),
    fontWeight: "700",
    marginBottom: 10,
  },
  taskText: {
    fontSize: RFPercentage(1.92),
    color: "#666",
    marginBottom: 16,
  },
  dueDateText: {
    fontSize: RFPercentage(2),
    fontWeight: "700",
    color: "grey",
  },
  dueDateDescriptionText: {
    color: "#333",
    fontSize: RFPercentage(1.92),
    fontWeight: "600",
    marginRight: 10,
  },
  statusIconBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 42,
    height: 42,
  },
  attachmentsIcon: {
    padding: 3,
    paddingRight: 10,
  },
});
