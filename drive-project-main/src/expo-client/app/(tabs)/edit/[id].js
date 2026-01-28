import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchGetFile, fetchUpdateFile } from '../../../fetches';
import { styles } from '../../../styles/edit.styles';

function EditFile() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [file, setFile] = useState({});
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const titleRef = useRef('');
    const contentRef = useRef('');

    const userId = localStorage.getItem('token');

    useEffect(() => {
        const loadFile = async () => {
            setIsLoading(true);
            const data = await fetchGetFile(id, userId);
            if (data) {
                const directPerms = data.permissions ? data.permissions[userId] : undefined;
                const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;

                setIsAllowed(Boolean(canWrite));
                if (!canWrite) {
                    setIsLoading(false);
                    router.replace('/'); 
                    return;
                }
                setFile(data);
                // Initialize ref values
                titleRef.current = data.title;
                contentRef.current = data.content;
            }
            setIsLoading(false);
        };
        loadFile();
    }, [id]);

    const handleSave = async () => {
        if (!isAllowed) return;
        
        const updatedTitle = titleRef.current;
        const updatedContent = contentRef.current || "";
        
        await fetchUpdateFile(id, userId, updatedTitle, updatedContent);
        router.replace('/');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {isLoading && <Text style={styles.loadingText}>Loading...</Text>}

                {/* Title Group */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        type="text"
                        defaultValue={file.title}
                        onChangeText={(text) => (titleRef.current = text)}
                    />
                </View>

                {/* Content Group */}
                {file.type === 'file' && (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            multiline
                            numberOfLines={5}
                            defaultValue={file.content}
                            onChangeText={(text) => (contentRef.current = text)}
                        />
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.saveBtn, (!isAllowed || isLoading) && styles.disabledBtn]} 
                        onPress={handleSave}
                        disabled={!isAllowed || isLoading}
                    >
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default EditFile;