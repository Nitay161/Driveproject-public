import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    title: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
    separator: { height: 1, backgroundColor: '#dee2e6', marginVertical: 15 },
    content: { fontSize: 16, color: '#495057', lineHeight: 24 },
    errorAlert: {
        backgroundColor: '#f8d7da',
        padding: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f5c6cb',
        marginBottom: 15
    },
    errorText: { color: '#721c24' },
    buttonRow: { flexDirection: 'row', marginTop: 30 },
    backBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#6c757d',
        marginRight: 10
    },
    backBtnText: { color: '#6c757d', fontWeight: '500' },
    editBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        backgroundColor: '#ffc107', // Warning yellow
    },
    editBtnText: { color: '#212529', fontWeight: 'bold' },
});