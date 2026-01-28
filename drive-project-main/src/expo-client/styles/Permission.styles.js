import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: '#fff',
    },
    userInfo: {
        marginBottom: 10,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Better for small screens
    },
    checkboxGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    checkbox: {
        width: 18,
        height: 18,
    },
    label: {
        fontSize: 13,
        marginLeft: 6,
        color: '#495057',
    },
    btnGroup: {
        flexDirection: 'row',
    },
    saveBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#007bff',
        marginRight: 8,
    },
    saveBtnText: {
        color: '#007bff',
        fontSize: 13,
        fontWeight: '600',
    },
    deleteBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dc3545',
    },
    deleteBtnText: {
        color: '#dc3545',
        fontSize: 13,
        fontWeight: '600',
    },
});
