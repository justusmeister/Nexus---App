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
import { useTheme } from "@react-navigation/native";

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
  const { colors } = useTheme();
  const [dots, setDots] = useState("...");

  useEffect(() => {
    let goesForward = true;
    if (title !== "E-Mail Postfach") return;

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
          <Icon.Feather
            name={icon}
            size={22}
            color="#ffffff"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: "#ffffff",
              fontSize: RFPercentage(2.54),
              fontFamily: "Inter_600SemiBold",
              marginBottom: 5,
              paddingTop: 3,
            }}
          >
            {title}
          </Text>
        </View>
        {isRefreshing && !isLoading && (
          <ActivityIndicator size="small" color={"white"} />
        )}
        <Icon.Feather
          name="chevron-right"
          size={20}
          color="#ffffff"
          style={{ alignSelf: "center" }}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size={"small"} color={"white"} />
          {title === "E-Mail Postfach" ? (
            <View style={styles.loadingTextRow}>
              <Text style={[styles.loadingMailText, { color: "white" }]}>
                Postfach wird geladen
              </Text>
              <Text style={[styles.dots, { color: "white" }]}>{dots}</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.infoBoxOuterView}>
          {content.map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoBox,
                { borderColor: colors.border },
                item.style,
              ]}
            >
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
    fontWeight: "400",
    fontSize: RFPercentage(1.79),
    width: RFPercentage(3),
    textAlign: "left",
  },
  loadingMailText: {
    fontWeight: "400",
    fontSize: RFPercentage(1.79),
  },
});
