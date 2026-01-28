import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/storage';

export default function File({ file, refresh }) {
    const router = useRouter();

    const handleDelete = async () => {
        const token = await getToken('token');
        try {
            await fetch(`http://10.0.2.2:5000/api/files/${file.id}`, {
                method: 'DELETE',
                headers: { 'User-Id': token }
            });
            refresh();
        } catch (e) {
            Alert.alert("Error", "Could not delete file");
        }
    };

    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => {
                if(file.type === 'folder') {
                    // Navigate inside folder (logic to be implemented in index.js usually)
                    Alert.alert("Open Folder", file.title);
                } else {
                    router.push(`/view/${file.id}`);
                }
            }}
        >
            <Ionicons 
                name={file.type === 'folder' ? "folder" : "document-text"} 
                size={40} 
                color={file.type === 'folder' ? "#F8D775" : "#4A90E2"} 
            />
            <View style={styles.info}>
                <Text style={styles.title}>{file.title}</Text>
                <Text style={styles.date}>{new Date(file.last).toLocaleDateString()}</Text>
            </View>
            
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => router.push(`/move/${file.id}`)}>
                    <Ionicons name="move" size={20} color="gray" style={{marginRight: 10}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', backgroundColor: 'white' },
    info: { flex: 1, marginLeft: 15 },
    title: { fontSize: 16, fontWeight: '500' },
    date: { fontSize: 12, color: 'gray' },
    actions: { flexDirection: 'row' }
});