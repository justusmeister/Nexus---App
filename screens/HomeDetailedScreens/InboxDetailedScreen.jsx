import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { iServInboxDummyData } from "../HomeStack";

const InboxDetailedScreen = ({ data, index }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (index !== null && index !== undefined) {
        const email = iServInboxDummyData[index];
        setCurrentEmail(email);
        setModalVisible(true);
      } else {
        console.log("Kein Index vorhanden");
      }
    }, 300);
  }, [index]);

  const resultBox = ({ item }) => {
    return (
      <Pressable
        style={styles.deadlineResult}
        onPress={() => {
          setCurrentEmail(item);
          setModalVisible(true);
        }}
      >
        <View>
          <View style={styles.emailPreview}>
            <Text style={styles.emailAuthor}>{item.author}</Text>
            <Text style={styles.emailDate}>{item.date}</Text>
          </View>
          <Text style={styles.emailTitle}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={resultBox}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 8 }}
      />
      <EmailModal
        visible={isModalVisible}
        email={currentEmail}
        onClose={() => setModalVisible(false)}
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
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <View style={styles.emailHeader}>
                <Text style={styles.sender}>{email?.author}</Text>
                <Text style={styles.subject}>{email?.title}</Text>
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
    borderRadius: 10,
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
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#000",
  },
  emailHeader: {
    marginBottom: 10,
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  subject: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#999",
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
  deadlineResult: {
    width: "100%",
    height: 100,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    padding: 8,
    backgroundColor: "green",
  },
  emailPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
  },
  emailDate: {
    fontSize: 12,
    color: "#363636",
  },
  emailTitle: {
    color: "white",
    fontSize: 13,
  },
});

export default InboxDetailedScreen;
