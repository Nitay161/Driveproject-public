import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 120,
    },
    typeToggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 4,
        overflow: 'hidden',
    },
    typeBtn: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    typeBtnActive: {
        backgroundColor: '#e9ecef',
    },
    typeBtnText: { color: '#495057' },
    typeBtnTextActive: { fontWeight: 'bold', color: '#007bff' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    backBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    backBtnText: { color: '#6c757d' },
    saveBtn: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 4,
        backgroundColor: '#007bff',
    },
    saveBtnText: { color: '#fff', fontWeight: 'bold' },
});