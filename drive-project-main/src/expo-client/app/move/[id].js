import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getToken } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function MoveToFolder() {
    const { id } = useLocalSearchParams();
    const [folders, setFolders] = useState([]);
    const router = useRouter();

    useEffect(() => { fetchFolders(); }, []);

    const fetchFolders = async () => {
        const token = await getToken('token');
        try {
            const res = await fetch('http://10.0.2.2:5000/api/files', {
                headers: { 'User-Id': token }
            });
            const data = await res.json();
            // Filter only folders and exclude current item
            setFolders(data.filter(item => item.type === 'folder' && item.id !== id));
        } catch(e) { console.error(e); }
    };

    const handleMove = async (folderId) => {
        const token = await getToken('token');
        try {
            const res = await fetch(`http://10.0.2.2:5000/api/files/${id}/move`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'User-Id': token },
                body: JSON.stringify({ folderId: folderId }) 
            });

            if (res.ok) {
                Alert.alert("Success", "File moved");
                router.back();
            } else {
                Alert.alert("Error", "Failed to move");
            }
        } catch(e) { Alert.alert("Error", "Network error"); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Destination</Text>
            <TouchableOpacity onPress={() => handleMove(null)} style={styles.rootItem}>
                <Ionicons name="folder-open" size={24} color="black" />
                <Text style={styles.folderName}>Root Directory</Text>
            </TouchableOpacity>

            <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleMove(item.id)} style={styles.item}>
                        <Ionicons name="folder" size={24} color="#F8D775" />
                        <Text style={styles.folderName}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Cancel" onPress={() => router.back()} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
    item: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
    rootItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
    folderName: { marginLeft: 10, fontSize: 16 }
});