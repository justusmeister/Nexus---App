import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  slideTitle: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  slideSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
    lineHeight: 22,
  },
  optionalText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  requiredText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modernButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
});