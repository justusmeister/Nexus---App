import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const FormSheetModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleModal} style={styles.openButton}>
        <Text style={styles.textStyle}>Open Form Sheet</Text>
      </Pressable>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        animationIn="slideInUp"    // Modal fährt von unten nach oben aus
        animationOut="slideOutDown" // Modal fährt nach unten zurück
        backdropOpacity={0.3}      // Hintergrund abdunkeln
        useNativeDriver={true}     // Animation performanter machen
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>This is a Form Sheet Modal</Text>
          <Pressable onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
  },
  modal: {
    justifyContent: 'flex-end',  // Modal kommt von unten
    margin: 0,  // Randloser Modal, um ihn an den unteren Rand zu bringen
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
});

export default FormSheetModal;
