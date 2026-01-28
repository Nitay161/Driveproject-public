import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { fetchDeletePerms, fetchGetUser, fetchUpdatePerms } from '../fetches';
import { styles } from '../styles/Permission.styles';

function Permission({ fId, pId, perms }) {
    const userId = localStorage.getItem('token');
    const [displayName, setDisplayName] = useState(pId);

    // Controlled states for checkboxes to ensure visual updates
    const [read, setRead] = useState((perms & 1) !== 0);
    const [write, setWrite] = useState((perms & 2) !== 0);
    const [del, setDel] = useState((perms & 4) !== 0);

    // Load username based on pId (User ID)
    useEffect(() => {
        const loadUser = async () => {
            const user = await fetchGetUser(pId);
            if (user && user.username) {
                setDisplayName(user.username);
            } else {
                setDisplayName(pId);
            }
        };
        loadUser();
    }, [pId]);

    // Update Permissions logic
    const handleUpdatePerms = async () => {
        let newPerms = 0;
        if (read) newPerms += 1;
        if (write) newPerms += 2;
        if (del) newPerms += 4;

        console.log(newPerms)
        fetchUpdatePerms(fId, userId, pId, newPerms);
    };

    const handleDeletePerms = () => {
        fetchDeletePerms(fId, userId, pId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>User: {displayName}</Text>
            </View>

            <View style={styles.controlsContainer}>
                {/* Permissions Checkboxes */}
                <View style={styles.checkboxGroup}>
                    <View style={styles.checkboxWrapper}>
                        <Checkbox
                            style={styles.checkbox}
                            value={read}
                            onValueChange={setRead}
                            color={read ? '#007bff' : undefined}
                        />
                        <Text style={styles.label}>Read</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                        <Checkbox
                            style={styles.checkbox}
                            value={write}
                            onValueChange={setWrite}
                            color={write ? '#007bff' : undefined}
                        />
                        <Text style={styles.label}>Write</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                        <Checkbox
                            style={styles.checkbox}
                            value={del}
                            onValueChange={setDel}
                            color={del ? '#007bff' : undefined}
                        />
                        <Text style={styles.label}>Delete</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.btnGroup}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePerms}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePerms}>
                        <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Permission;