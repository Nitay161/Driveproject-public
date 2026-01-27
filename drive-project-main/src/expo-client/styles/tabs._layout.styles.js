import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#007AFF',
    height: 70,
    width: '100%',
    justifyContent: 'center',
  },
  headerContent: {
    paddingLeft: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  sideMenuContainer: {
    width: 240, // Fixed width
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
    paddingTop: 20,
    height: '100%',
  },
  createButtonContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
    elevation: 2,
  },
  createButtonText: {
    fontWeight: '600',
    color: '#212529',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#e9ecef',
  },
  navButtonText: {
    fontSize: 15,
    color: '#495057',
  },
  navButtonTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  // Ensure your screens use this style
  screenContent: {
    flex: 1,
    padding: 20,
  }
});