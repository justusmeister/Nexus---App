import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
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
  const [dots, setDots] = useState("...");

  useEffect(() => {
    let goesForward = true;
    if (title !== "Postfach") return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") {
          goesForward = false;
          return "..";
        }
        if (prev === ".." && !goesForward) return ".";
        if (prev === "." && !goesForward) return "";
        if (prev === "") {
          goesForward = true;
          return ".";
        }
        if (prev === ".." && goesForward) return "...";
        return "..";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [title]);

  return (
    <TouchableOpacity
      style={[styles.boxSize, style]}
      activeOpacity={0.4}
      onPress={onPress}
    >
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
              fontSize: RFPercentage(2.69),
              marginBottom: 5,
              paddingTop: 3,
            }}
          >
            {title}
          </Text>
        </View>
        {isRefreshing && !isLoading && <ActivityIndicator size="small" color="white" />}
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
          {title === "Postfach" ? (
            <View style={styles.loadingTextRow}>
              <Text style={styles.loadingMailText}>Postfach wird geladen</Text>
              <Text style={styles.dots}>{dots}</Text>
            </View>
          ) : null}
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
  loadingTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  dots: {
    color: "white",
    fontWeight: "400",
    fontSize: RFPercentage(1.79),
    width: RFPercentage(3),
    textAlign: "left",
  },
  loadingMailText: {
    color: "white",
    fontWeight: "400",
    fontSize: RFPercentage(1.79),
  },
});
