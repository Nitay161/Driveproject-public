import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCreateFile } from '../../fetches';
import { styles } from '../../styles/create.styles';

export default function CreateFile() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('file'); // 'file' or 'folder'
    
    const router = useRouter();
    const userId = localStorage.getItem('token');

    const handleSave = async () => {
        // Validation: Title is required
        if (!title.trim()) return;

        const fcontent = type === 'file' ? content : "";
        
        await fetchCreateFile(userId, title, fcontent, type);
        router.replace('/'); 
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {/* 1. TYPE SELECTOR */}
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeToggleContainer}>
                    <TouchableOpacity 
                        style={[styles.typeBtn, type === 'file' && styles.typeBtnActive]} 
                        onPress={() => setType('file')}
                    >
                        <Text style={[styles.typeBtnText, type === 'file' && styles.typeBtnTextActive]}>File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeBtn, type === 'folder' && styles.typeBtnActive]} 
                        onPress={() => setType('folder')}
                    >
                        <Text style={[styles.typeBtnText, type === 'folder' && styles.typeBtnTextActive]}>Folder</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. TITLE INPUT */}
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />

                {/* 3. CONTENT INPUT */}
                {type === 'file' && (
                    <>
                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={content}
                            onChangeText={setContent}
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </>
                )}

                {/* 4. ACTIONS */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}