import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const InboxDetailedScreen = ({ data, index }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const buttonScale = useState(new Animated.Value(1))[0];
  useEffect(() => {
    setTimeout(() => {
      if (index !== null && index !== undefined) {
        const email = data[index];
        setCurrentEmail(email);
        setIsModalVisible(true);
      }
    }, 300);
  }, [index]);

  const resultBox = ({ item, index }) => {
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

    return (
      <Animated.View
        style={[
          styles.newsBoxContainer,
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
          onPress={() => {
            setCurrentEmail(item);
            setIsModalVisible(true);
          }}
        >
          <View style={styles.newsBox}>
            {item.read ? null : (
              <Icon.FontAwesome
                name="circle"
                size={10}
                color={"orange"}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 15,
                  zIndex: 1,
                }}
              />
            )}
            <Text
              style={[
                styles.newsBoxAuthor,
                { fontWeight: item.read ? "500" : "700" },
              ]}
            >
              {item.author}
            </Text>
            <Text style={styles.newsBoxContent}>{item.title}</Text>
            <Text style={styles.newsBoxDate}>{item.date}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={resultBox}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 8 }}
      />
      <EmailModal
        visible={isModalVisible}
        email={currentEmail}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const EmailModal = ({ visible, email, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon.Ionicons
                  name="close-circle-sharp"
                  size={32}
                  color="#333"
                />
              </TouchableOpacity>
              <View style={styles.emailHeader}>
                <Text style={styles.sender}>{email?.author}</Text>
                <Text style={styles.title}>{email?.title}</Text>
                <Text style={styles.date}>{email?.date}</Text>
              </View>
              <View style={styles.divider} />
              <ScrollView style={styles.bodyContainer}>
                <WebView
                  originWhitelist={["*"]}
                  source={{
                    html: "<p>No Content Available</p>",
                  }}
                  style={styles.webView}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "87%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#4A90E2",
  },
  emailHeader: {
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4A90E2",
  },
  title: {
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  bodyContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    borderRadius: 10,
  },
  newsBoxContainer: {
    marginVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsBox: {
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#4A90E2",
  },
  newsBoxAuthor: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  newsBoxContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  newsBoxDate: {
    fontSize: 12,
    color: "#999",
  },
});

export default InboxDetailedScreen;
