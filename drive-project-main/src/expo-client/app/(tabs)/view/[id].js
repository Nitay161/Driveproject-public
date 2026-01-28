import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchGetFile } from '../../../fetches';
import { styles } from '../../../styles/view.styles';

export default function ViewFile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [file, setFile] = useState(null);

    const userId = localStorage.getItem('token');

    useEffect(() => {
        const loadFile = async () => {
            const data = await fetchGetFile(id, userId);
            setFile(data || { error: "Failed to load" });
        };
        loadFile();
    }, [id]);


    if (!file || file.error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorAlert}>
                    <Text style={styles.errorText}>Error loading file: {file?.error || "Unknown error"}</Text>
                </View>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{file.title}</Text>
                
                {/* Visual Horizontal Rule */}
                <View style={styles.separator} />
                
                <Text style={styles.content}>{file.content}</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.editBtn} 
                        onPress={() => router.push(`/edit/${id}`)}
                    >
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}