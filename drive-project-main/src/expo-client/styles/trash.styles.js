import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 16, color: '#333' },
  list: { borderTopWidth: 1, borderTopColor: '#eee' },
  trashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoArea: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 18, marginRight: 10 },
  fileTitle: { fontSize: 15, color: '#333', flexShrink: 1 },
  buttonGroup: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: 8,
  },
  restoreBtn: { borderColor: '#007bff' },
  restoreText: { color: '#007bff', fontSize: 13, fontWeight: '500' },
  deleteBtn: { borderColor: '#dc3545' },
  deleteText: { color: '#dc3545', fontSize: 13, fontWeight: '500' },
  emptyState: { padding: 60, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
});