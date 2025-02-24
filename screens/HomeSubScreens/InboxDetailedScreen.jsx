import { WebView } from "react-native-webview";
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
import { RFPercentage } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

function formatDate(isoString) {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    ", " +
    date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function extractName(from) {
  if (!from) return ""; // Falls from null, undefined oder leer ist, gib leeren String zurück
  const match = from.match(/"?(.*?)"?\s*<.*@.*>/);
  return match ? match[1] : from; // Falls Name existiert, bereinigt zurückgeben
}

const InboxDetailedScreen = ({ data, index }) => {
  const tabBarHeight = useBottomTabBarHeight();
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
          style={{ justifyContent: "space-between", flexDirection: "row" }}
        >
          <View style={styles.newsBox}>
            <Text
              style={[
                styles.newsBoxAuthor,
                { fontWeight: item.read ? "500" : "700" },
              ]}
            >
              {extractName(item.from)}
            </Text>
            <Text style={styles.newsBoxContent}>{item.subject}</Text>
            <Text style={styles.newsBoxDate}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.inboxSubBox}>
            {item.read ? null : (
              <Icon.FontAwesome
                name="circle"
                size={10}
                color={"orange"}
                style={{
                  zIndex: 1,
                }}
              />
            )}
            {item.attachments.length > 0 ? (
              <Icon.FontAwesome
                name="paperclip"
                size={20}
                color={"black"}
                style={{
                  zIndex: 1,
                }}
              />
            ) : null}
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: tabBarHeight + 6 }}>
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

const emailPlainText = {
  author: "noreply@iserv.de",
  title: "iServ Benachrichtigung",
  date: "24. Januar 2025",
  isPlainText: true,
  content: `Hallo Justus,

Dies ist eine E-Mail in Plaintext. Keine Formatierung, nur reiner Text.
Ich schreibe diese Email um ihnen einen guten Eindruck zu vermitteln wie eine 
Email in dieser App aussehen könnte. Wenn sie die komplette Seite Scrollen möchten muss der Inhalt länger sein als die Höhe der ScrollView.

Vielen Dank für ihr Verständnis und einen schönen Tag noch.

Beste Grüße,
Dein iServ Team`,
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
                <Text style={styles.sender}>{extractName(email?.from)}</Text>
                <Text style={styles.title}>{email?.subject}</Text>
                <Text style={styles.date}>{formatDate(email?.date)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.bodyContainer}>
                {0 === 0 ? (
                  <ScrollView>
                    <Pressable>
                      <Text style={styles.emailContentText}>{email?.text}</Text>
                      {email?.attachments.length > 0 && (
                        <View>
                          {email?.attachments.map((attachment, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() =>
                                openAttachment(
                                  attachment.filename,
                                  attachment.data
                                )
                              }
                              style={{
                                padding: 8,
                                marginTop: 5,
                                borderRadius: 8,
                                backgroundColor: "#f0f0f0",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon.FontAwesome
                                name="paperclip"
                                size={16}
                                color="black"
                                style={{ marginRight: 5 }}
                              />
                              <Text
                                style={{ color: "#007AFF", fontWeight: "500" }}
                              >
                                {attachment.filename}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </Pressable>
                  </ScrollView>
                ) : (
                  <TouchableWithoutFeedback>
                    <WebView
                      style={styles.webView}
                      originWhitelist={["-"]}
                      source={{
                        html: email?.text,
                      }}
                      javaScriptEnabled={false}
                      scalesPageToFit={false}
                    />
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const openAttachment = async (filename, base64Data) => {
  try {
    const path = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(path, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const available = await Sharing.isAvailableAsync();
    if (available) {
      await Sharing.shareAsync(path);
    } else {
      alert("Das Öffnen von Dateien wird auf diesem Gerät nicht unterstützt.");
    }
  } catch (error) {
    console.error("Fehler beim Öffnen des Anhangs:", error);
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
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
    fontSize: RFPercentage(3.21),
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
    fontSize: RFPercentage(2.18),
    color: "#4A90E2",
  },
  title: {
    fontSize: RFPercentage(1.92),
    color: "#333",
  },
  date: {
    fontSize: RFPercentage(1.67),
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
    maxWidth: "85%",
  },
  newsBoxAuthor: {
    fontSize: RFPercentage(2.05),
    color: "#333",
    marginBottom: 5,
  },
  newsBoxContent: {
    fontSize: RFPercentage(1.92),
    color: "#666",
    marginBottom: 5,
  },
  newsBoxDate: {
    fontSize: RFPercentage(1.67),
    color: "#999",
  },
  emailContentText: {
    fontSize: RFPercentage(1.92),
    fontWeight: "400",
    color: "#333",
  },
  inboxSubBox: {
    alignItems: "center",
    justifyContent: "space-evenly",
    marginRight: 15,
  },
});

export default InboxDetailedScreen;
