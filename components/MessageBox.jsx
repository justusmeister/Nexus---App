import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const MessageBox = function ({
  titleStyle,
  style,
  onPress,
  title,
  icon,
  content = [{}],
  isLoading,
  isRefreshing,
}) {
  return (
    <TouchableOpacity
      style={[styles.boxSize, style]}
      activeOpacity={0.4}
      onPress={onPress}
    >
      <View
        style={[
          styles.titleBox,
          titleStyle,
        ]}
      >
        <View style={styles.title}>
          <Icon.FontAwesome
            name={icon}
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: RFPercentage(2.69),
              marginBottom: 5,
              paddingTop: 3,
            }}
          >
            {title}
          </Text>
        </View>
        {isRefreshing && (
        <ActivityIndicator size="small" color="white" />
      )}
        <Icon.Entypo
          name="chevron-right"
          size={23}
          color="white"
          style={{ alignSelf: "center" }}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size={"small"} color={"white"} />
        </View>
      ) : (
        <View style={styles.infoBoxOuterView}>
          {content.map((item, index) => (
            <View key={index} style={[styles.infoBox, item.style]}>
              {item.content}
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  boxSize: {
    width: "100%",
    shadowColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  titleBox: {
    width: "85%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBoxOuterView: {
    width: "90%",
    height: "70%",
    justifyContent: "space-between",
  },
  infoBox: {
    width: "100%",
    height: "30%",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#b3b3ba",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingBox: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
});
