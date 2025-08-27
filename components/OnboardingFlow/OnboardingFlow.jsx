import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme } from '@react-navigation/native';

import ProgressBar from './components/ProgressBar';
import NameSlide from './components/NameSlide';
import RegionSlide from './components/RegionSlide';
import IntegrationSlide from './components/IntegrationSlide';
import NavigationButtons from './components/NavigationButtons';
import { validateName, validateRegion } from './utils/validation';

const OnboardingFlow = ({ onComplete }) => {
  const theme = useTheme();
  const pagerRef = useRef(null);
  
  // States
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [hasSkippedLastSlide, setHasSkippedLastSlide] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Validation functions
  const isNameValid = useCallback(() => validateName(name), [name]);
  const canProceedFromRegionSelection = useCallback(() => validateRegion(selectedRegion), [selectedRegion]);

  // Navigation functions with proper validation and state management
  const goToPage = useCallback(async (page) => {
    if (isNavigating) return;
    
    // Validation checks
    if (page === 1 && currentPage === 0 && !isNameValid()) {
      Alert.alert('Name erforderlich', 'Bitte geben Sie einen Namen mit mindestens 2 Zeichen ein.');
      return;
    }
    
    if (page === 2 && !canProceedFromRegionSelection()) {
      Alert.alert('Region erforderlich', 'Bitte wählen Sie Ihre Region aus, um fortzufahren.');
      return;
    }

    setIsNavigating(true);
    
    try {
      pagerRef.current?.setPage(page);
      // Wait for the page transition to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentPage(page);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  }, [currentPage, isNameValid, canProceedFromRegionSelection, isNavigating]);

  const nextPage = useCallback(() => {
    if (currentPage < 2) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const skipToNext = useCallback(() => {
    if (currentPage < 2) {
      const nextPageIndex = currentPage + 1;
      // Bei Skip zu Slide 2 ohne Name wird der Name auf "Gast" gesetzt
      if (currentPage === 0 && !isNameValid()) {
        setName('Gast');
      }
      goToPage(nextPageIndex);
    }
  }, [currentPage, isNameValid, goToPage]);

  // Handler functions
  const handleComplete = useCallback(() => {
    const userData = {
      name: name.trim() || 'Gast',
      country: selectedCountry,
      region: selectedRegion
    };
    
    console.log('Onboarding abgeschlossen:', userData);
    
    if (onComplete && typeof onComplete === 'function') {
      onComplete(userData);
    }
  }, [name, selectedCountry, selectedRegion, onComplete]);

  const handleSkipLastSlide = useCallback(() => {
    setHasSkippedLastSlide(true);
  }, []);

  const handleCountryChange = useCallback((country) => {
    if (country !== selectedCountry) {
      setSelectedCountry(country);
      setSelectedRegion(''); // Reset region when country changes
    }
  }, [selectedCountry]);

  const handleRegionSelect = useCallback((region) => {
    setSelectedRegion(region);
  }, []);

  const handleNameChange = useCallback((text) => {
    // Begrenzen auf 50 Zeichen und entfernen unerwünschter Zeichen
    const cleanText = text.replace(/[^\w\s-äöüßÄÖÜ]/g, '').slice(0, 50);
    setName(cleanText);
  }, []);

  // PagerView page change handler - Allow swiping except when region not selected
  const handlePageSelected = useCallback((e) => {
    const newPage = e.nativeEvent.position;
    
    // Prevent swiping to page 2 if no region is selected
    if (newPage === 2 && currentPage === 1 && !canProceedFromRegionSelection()) {
      // Go back to previous page
      setTimeout(() => {
        pagerRef.current?.setPage(currentPage);
      }, 100);
      Alert.alert('Region erforderlich', 'Bitte wählen Sie Ihre Region aus, um fortzufahren.');
      return;
    }
    
    setCurrentPage(newPage);
  }, [currentPage, canProceedFromRegionSelection]);

  // Memoized props objects to prevent unnecessary re-renders
  const progressProps = {
    currentPage,
    isNameValid: isNameValid(),
    canProceedFromRegionSelection: canProceedFromRegionSelection(),
    hasSkippedLastSlide,
    theme
  };

  const nameSlideProps = {
    name,
    isNameValid: isNameValid(),
    onNameChange: handleNameChange,
    onSkip: skipToNext,
    onNext: nextPage,
    isNavigating,
    theme
  };

  const regionSlideProps = {
    selectedCountry,
    selectedRegion,
    onCountryChange: handleCountryChange,
    onRegionSelect: handleRegionSelect,
    isNavigating,
    theme
  };

  const integrationSlideProps = {
    onSkip: handleSkipLastSlide,
    isNavigating,
    theme
  };

  const navigationProps = {
    currentPage,
    canProceedFromRegionSelection: canProceedFromRegionSelection(),
    hasSkippedLastSlide,
    onPrevPage: prevPage,
    onNextPage: nextPage,
    onComplete: handleComplete,
    isNavigating,
    theme
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ProgressBar {...progressProps} />
      
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
        pageMargin={0}
        overdrag={false}
      >
        <View key="1" style={styles.page}>
          <NameSlide {...nameSlideProps} />
        </View>
        <View key="2" style={styles.page}>
          <RegionSlide {...regionSlideProps} />
        </View>
        <View key="3" style={styles.page}>
          <IntegrationSlide {...integrationSlideProps} />
        </View>
      </PagerView>
      
      <NavigationButtons {...navigationProps} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});

export default OnboardingFlow;