import React, { useState } from 'react';
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import licenses from '../assets/licenses.json';

export default function LicensesModal({ visible, onClose }) {
  const licenseList = Object.entries(licenses); // [[packageName, data], ...]
  const [selectedLicense, setSelectedLicense] = useState(null);

  // Liste der Pakete
  const renderItem = ({ item }) => {
    const [packageName] = item;

    return (
      <TouchableOpacity
        onPress={() => setSelectedLicense(item)}
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
      </TouchableOpacity>
    );
  };

  // Detailansicht mit vollem Lizenztext & Metadaten
  const renderDetail = () => {
    if (!selectedLicense) return null;
    const [packageName, data] = selectedLicense;

    return (
      <View style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
          onPress={() => setSelectedLicense(null)}
          style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={{ marginLeft: 8, fontSize: 16, color: '#333' }}>Zurück</Text>
        </TouchableOpacity>

        <ScrollView>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            {packageName}
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            Lizenz: {data.licenses || 'Keine Angabe'}
          </Text>

          {data.publisher && (
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Autor: {data.publisher}
            </Text>
          )}

          {data.repository && (
            <Text
              style={{ fontSize: 16, color: '#2563eb', marginBottom: 8 }}
              onPress={() => Linking.openURL(data.repository)}
            >
              {data.repository}
            </Text>
          )}

          {/* Hier der volle Lizenztext */}
          {data.licenseText ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Lizenztext
              </Text>
              <Text style={{ fontSize: 14, color: '#444' }}>{data.licenseText}</Text>
            </>
          ) : (
            <Text style={{ fontSize: 14, color: '#888', marginTop: 20 }}>
              Kein Lizenztext verfügbar.
            </Text>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}
        >
          {selectedLicense ? (
            <TouchableOpacity onPress={() => setSelectedLicense(null)}>
              <Ionicons name="arrow-back" size={30} color="#333" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 30 }} />
          )}

          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
            {selectedLicense ? selectedLicense[0] : 'Lizenzen'}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Inhalt: Liste oder Detail */}
        {selectedLicense ? (
          renderDetail()
        ) : (
          <FlashList
            data={licenseList}
            renderItem={renderItem}
            estimatedItemSize={50}
            keyExtractor={([packageName]) => packageName}
            contentContainerStyle={{ padding: 20, paddingTop: 0 }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
