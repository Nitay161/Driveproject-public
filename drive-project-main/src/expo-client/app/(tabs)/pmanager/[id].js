import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Permission from '../../../components/Permission';
import { fetchGetFile, fetchGetPerms } from '../../../fetches';

function ManagePerms() {
    const { id } = useLocalSearchParams();
    const [perms, setPerms] = useState({});
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const userId = localStorage.getItem('token');

    useEffect(() => {
        const loadPerms = async () => {
            setIsLoading(true);
            const file = await fetchGetFile(id, userId);
            const creatorId = file && (file.creatorId ?? file.creator);
            
            const allowed = creatorId !== undefined && String(creatorId) === String(userId);
            setIsAllowed(allowed);

            if (!allowed) {
                setIsLoading(false);
                router.navigate('/');
                return;
            }

            const data = await fetchGetPerms(id, userId);
            if (data) setPerms(data);
            setIsLoading(false);
        };
        loadPerms();
    }, [id, userId]);

    const listItems = Object.entries(perms).map(([pId, pValue]) => (
        <View key={pId} style={styles.listItem}>
            <Permission fId={id} pId={pId} perms={pValue} />
        </View>
    ));

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Manage Permissions</Text>

            {isLoading && <Text style={styles.loadingText}>Loading...</Text>}

            {!isLoading && !isAllowed && (
                <View style={styles.statusContainer}>
                    <Text style={styles.errorText}>Not authorized</Text>
                </View>
            )}

            <View style={styles.listGroup}>
                {listItems}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statusContainer: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        marginLeft: 10,
        color: '#6c757d',
    },
    errorText: {
        color: '#dc3545',
        fontWeight: 'bold',
    }
});

export default ManagePerms;