import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchDeleteFile, fetchStarFile, fetchUnStarFile, fetchGetUser } from '../fetches';
import { styles } from '../styles/File.styles';

const File = ({ id, title, isStarred, creator, type, date, canWrite, onNavigate, onRefresh }) => {
    const router = useRouter();
    const userId = localStorage.getItem('token');
    const [creatorName, setCreatorName] = useState(creator);
    const [menuVisible, setMenuVisible] = useState(false);
    const isOwner = String(creator) === String(userId);

    useEffect(() => {
        const loadCreator = async () => {
            if (creator) {
                const user = await fetchGetUser(creator);
                if (user && user.username) setCreatorName(user.username);
            }
        };
        loadCreator();
    }, [creator]);

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const handleDelete = async () => {
        await fetchDeleteFile(id, userId);
        if (onRefresh) onRefresh();
    };

    const handleStarAction = async () => {
        setMenuVisible(false);
        if (!isStarred) await fetchStarFile(id, userId);
        else await fetchUnStarFile(id, userId);
        if (onRefresh) onRefresh();
    };

    const MenuItem = ({ label, onPress, danger = false }) => (
        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); onPress(); }}>
            <Text style={[styles.menuItemText, danger && { color: '#dc3545' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.fileRow}>
            <TouchableOpacity 
                style={styles.leftSection} 
                onPress={() => type === 'folder' ? onNavigate?.(id) : router.push(`/view/${id}`)}
            >
                <Text style={styles.icon}>{type === 'folder' ? '📁' : '📄'}</Text>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.creatorText}>by {creatorName}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.rightSection}>
                {date && <Text style={styles.dateText}>{new Date(date).toLocaleDateString()}</Text>}
                
                <TouchableOpacity onPress={toggleMenu} style={styles.moreBtn}>
                    <Text style={styles.moreBtnText}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* DROPDOWN MENU MODAL */}
            <Modal visible={menuVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.dropdownMenu}>
                            {type === 'file' && <MenuItem label="View" onPress={() => router.push(`/view/${id}`)} />}
                            {canWrite && <MenuItem label="Edit" onPress={() => router.push(`/edit/${id}`)} />}
                            <MenuItem label="Move to" onPress={() => router.push(`/move/${id}`)} />
                            
                            {isOwner && (
                                <>
                                    <MenuItem label="Share" onPress={() => router.push(`/share/${id}`)} />
                                    <MenuItem label="Permissions" onPress={() => router.push(`/pmanager/${id}`)} />
                                </>
                            )}
                            
                            <MenuItem label={isStarred ? 'UnStar' : 'Star'} onPress={handleStarAction} />
                            <View style={styles.divider} />
                            <MenuItem label="Move to Trash" onPress={handleDelete} danger={true} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default File;