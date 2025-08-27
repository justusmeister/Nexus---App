// components/RegionsList.js
import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { REGIONS_DATA } from '../constants/data';

const RegionItem = memo(({ 
  region, 
  isSelected, 
  onPress, 
  isNavigating, 
  theme 
}) => {
  const handlePress = useCallback(() => {
    onPress(region.code);
  }, [onPress, region]);

  return (
    <TouchableOpacity
      style={[
        styles.modernRegionItem,
        {
          backgroundColor: isSelected ? theme.colors.primary + '15' : theme.colors.card,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isNavigating}
    >
      <Text
        style={[
          styles.regionItemText,
          {
            color: isSelected ? theme.colors.primary : theme.colors.text,
            fontFamily: theme.fonts?.regular || 'System',
            fontWeight: isSelected ? '600' : '400'
          }
        ]}
      >
        {region.label}
      </Text>
      {isSelected && (
        <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const RegionsList = memo(({ 
  selectedCountry, 
  selectedRegion, 
  onRegionSelect, 
  isNavigating, 
  theme 
}) => {
  const regionsData = useMemo(() => {
    return REGIONS_DATA[selectedCountry].map((region) => ({
      id: region.code,
      region: region,
      isSelected: selectedRegion === region.code,
    }));
  }, [selectedCountry, selectedRegion]);

  const keyExtractor = useCallback((item) => `${selectedCountry}-${item.id}`, [selectedCountry]);

  const renderItem = useCallback(({ item }) => (
    <RegionItem
      region={item.region}
      isSelected={item.isSelected}
      onPress={onRegionSelect}
      isNavigating={isNavigating}
      theme={theme}
    />
  ), [onRegionSelect, isNavigating, theme]);

  const ItemSeparator = useCallback(() => <View style={styles.itemSeparator} />, []);

  return (
    <View style={styles.regionsList}>
      <FlatList
        data={regionsData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        scrollEnabled={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  regionsList: {
    flex: 1,
    paddingBottom: 20,
  },
  modernRegionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 56,
  },
  regionItemText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 20,
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemSeparator: {
    height: 8,
  },
});

export default RegionsList;