import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox'; 
import { fetchAddPerms, fetchGetFile } from '../../../fetches';
import { styles } from '../../../styles/share.styles';

export default function Share() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    
    const [read, setRead] = useState(false);
    const [write, setWrite] = useState(false);
    const [del, setDel] = useState(false);

    const userId = localStorage.getItem('token');

    useEffect(() => {
        const checkOwner = async () => {
            setIsLoading(true);
            const file = await fetchGetFile(id, userId);

            const creatorId = file && (file.creatorId ?? file.creator);
            const allowed = creatorId !== undefined && String(creatorId) === String(userId);

            setIsAllowed(allowed);
            setIsLoading(false);

            if (!allowed) {
                router.replace('/');
            }
        };
        checkOwner();
    }, [id]);

    const handleSave = async () => {
        if (!isAllowed || !username.trim()) return;

        let perms = 0;
        if (read) perms += 1;
        if (write) perms += 2;
        if (del) perms += 4;

        await fetchAddPerms(id, userId, username, perms);
    };

    return (
        <ScrollView contentContainerStyle={styles.centerContainer} style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.header}>Share with others</Text>

                {isLoading && <Text style={styles.loadingText}>Loading...</Text>}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Permissions</Text>
                    <View style={styles.checkboxContainer}>
                        <View style={styles.checkboxWrapper}>
                            <Checkbox 
                                value={read} 
                                onValueChange={setRead} 
                                color={read ? '#007bff' : undefined} 
                            />
                            <Text style={styles.checkLabel}>Read</Text>
                        </View>
                        <View style={styles.checkboxWrapper}>
                            <Checkbox 
                                value={write} 
                                onValueChange={setWrite} 
                                color={write ? '#007bff' : undefined} 
                            />
                            <Text style={styles.checkLabel}>Write</Text>
                        </View>
                        <View style={styles.checkboxWrapper}>
                            <Checkbox 
                                value={del} 
                                onValueChange={setDel} 
                                color={del ? '#007bff' : undefined} 
                            />
                            <Text style={styles.checkLabel}>Delete</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.addBtn, (!isAllowed || isLoading) && styles.disabledBtn]} 
                        onPress={handleSave}
                        disabled={!isAllowed || isLoading}
                    >
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}