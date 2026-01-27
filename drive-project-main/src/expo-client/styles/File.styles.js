import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    fileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    icon: { fontSize: 24, marginRight: 12 },
    title: { fontSize: 16, fontWeight: '500' },
    creatorText: { fontSize: 12, color: '#888' },
    rightSection: { flexDirection: 'row', alignItems: 'center' },
    dateText: { fontSize: 12, color: '#aaa', marginRight: 10 },
    moreBtn: { padding: 8 },
    moreBtnText: { fontSize: 22, fontWeight: 'bold', color: '#666' },
    
    /* Dropdown Styles */
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
    dropdownMenu: { backgroundColor: 'white', borderRadius: 8, paddingVertical: 8, width: 200, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    menuItem: { paddingVertical: 12, paddingHorizontal: 20 },
    menuItemText: { fontSize: 16, color: '#333' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 4 }
});