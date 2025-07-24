import React from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import licenses from '../assets/licenses.json';

export default function LicensesModal({ visible, onClose }) {
  const licenseList = Object.entries(licenses); // [[packageName, data], ...]

  const renderItem = ({ item }) => {
    const [packageName, data] = item;

    return (
      <View
        style={{
          marginBottom: 24,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
          {packageName}
        </Text>
        <Text style={{ fontSize: 14, color: '#374151', marginTop: 4 }}>
          Lizenz: {data.licenses}
        </Text>
        {data.publisher && (
          <Text style={{ fontSize: 14, color: '#374151' }}>
            Autor: {data.publisher}
          </Text>
        )}
        {data.repository && (
          <Text
            style={{ fontSize: 14, color: '#2563eb', marginTop: 4 }}
            onPress={() => Linking.openURL(data.repository)}
          >
            {data.repository}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Close-Button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingTop: 10,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        {/* FlashList */}
        <FlashList
          data={licenseList}
          renderItem={renderItem}
          estimatedItemSize={80} // schätzt durchschnittliche Höhe
          keyExtractor={([packageName]) => packageName}
          contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        />
      </SafeAreaView>
    </Modal>
  );
}

// Gen: npx license-checker --json > assets/licenses.json
