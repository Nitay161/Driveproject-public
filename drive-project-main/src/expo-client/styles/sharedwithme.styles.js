import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});