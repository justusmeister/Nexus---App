import { useRef, useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome";

const subjectsListDummyData = [
  { id: 0, subject: "Mathe" },
  { id: 1, subject: "Informatik" },
  { id: 2, subject: "Deutsch" },
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"];
const icons = ["book", "laptop", "pencil", "calculator", "globe"];

const HomeworkScreen = function ({ navigation }) {
  const sheetRef = useRef(null);
  const [subjectName, setSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const inputRef = useRef(null);

  const resultBox = ({ item }) => (
    <Pressable
      style={{
        width: "100%",
        height: 100,
        marginVertical: 2,
        backgroundColor: "#c2c2c2",
        borderRadius: 15,
        padding: 10,
      }}
      onPress={() => navigation.navigate("GenericScreen")}
    >
      <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "500" }}>
        {item.subject}
      </Text>
    </Pressable>
  );

  const listFooterBox = () => (
    <View>
      <View>
        <Pressable
          style={{
            width: "100%",
            height: 60,
            marginVertical: 10,
            backgroundColor: "green",
            borderRadius: 25,
            padding: 10,
          }}
          onPress={() => {
            sheetRef.current.open();
            setSubjectName("");
            setSelectedColor(colors[0]);
            setSelectedIcon(icons[0]);
          }}
        >
          <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "500" }}>
            +
          </Text>
        </Pressable>
      </View>

      <View style={{ alignItems: "center", marginTop: 7.5 }}>
        <View
          style={{
            width: "95%",
            borderTopColor: "grey",
            borderTopWidth: 1,
            borderRadius: 15,
          }}
        />
      </View>
      <View>
        <Pressable
          style={{
            width: "100%",
            height: 100,
            marginTop: 17.5,
            backgroundColor: "#c2c2c2",
            borderRadius: 15,
            padding: 10,
          }}
          onPress={() => navigation.navigate("GenericScreen")}
        >
          <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: "500" }}>
            allgemeine Notizen
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EFEEF6" }}>
      <View style={[styles.screen, { marginBottom: 79, marginTop: 0 }]}>
        <FlatList
          data={subjectsListDummyData}
          renderItem={resultBox}
          keyExtractor={(item) => item.id.toString()}
          style={{ paddingVertical: 5 }}
          ListFooterComponent={listFooterBox}
        />
      </View>
      <RBSheet
        ref={sheetRef}
        closeOnPressMask={true}
        height={400}
        draggable={true}
        customStyles={{
          container: styles.sheet,
        }}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.stylesheetContainer}
        >
          <Text style={styles.label}>Name des Faches:</Text>
          <TextInput
            ref={inputRef}
            style={styles.subjectInputfield}
            placeholder="Name des Fachs"
            placeholderTextColor={"grey"}
            value={subjectName}
            onChangeText={setSubjectName}
            autoFocus={true}
          />
          <Text style={styles.label}>Farbe auswählen:</Text>
          <FlatList
            horizontal
            data={colors}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.colorChoosingBox,
                  {
                    backgroundColor: item,
                    borderWidth: item === selectedColor ? 1.5 : 0,
                  },
                ]}
                onPress={() => setSelectedColor(item)}
              />
            )}
            keyExtractor={(item) => item}
          />
          <Text style={styles.label}>Icon auswählen:</Text>
          <FlatList
            horizontal
            data={icons}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconChoosingBox,
                  { borderWidth: item === selectedIcon ? 1.5 : 0 },
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Icon name={item} size={30} color="grey" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <Pressable
            style={styles.confirmButton}
            onPress={() => sheetRef.current.close()}
          >
            <Text style={styles.buttonText}>Speichern</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </RBSheet>
    </View>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 14,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 89,
  },
  sheet: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stylesheetContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  subjectInputfield: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  colorChoosingBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 2,
  },
  iconChoosingBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderRadius: 10,
  },
  confirmButton: {
    width: 140,
    height: 45,
    backgroundColor: "#0066cc",
    borderRadius: 15,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
