import { StyleSheet, View, Pressable, Text } from "react-native";
import * as Icon from "@expo/vector-icons";

const MessageBox = function ({
  titleStyle,
  style,
  onPress,
  title,
  icon,
  content = [{}],
}) {
  return (
    <Pressable style={[styles.boxSize, style]} onPress={onPress}>
      <View style={[styles.titleBox, titleStyle]}>
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
              fontSize: 20,
              marginBottom: 5,
              paddingTop: 3,
            }}
          >
            {title}
          </Text>
        </View>
        <Icon.Entypo
          name="chevron-right"
          size={23}
          color="white"
          style={{ paddingTop: 3 }}
        />
      </View>
      <View style={styles.infoBoxOuterView}>
        {content.map((item, index) => (
          <View key={index} style={[styles.infoBox, item.style]}>
            {item.content}
          </View>
        ))}
      </View>
    </Pressable>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  boxSize: {
    width: "100%",
    height: "32%",
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
});
