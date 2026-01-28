import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import File from '../../components/File'; 
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/starred.styles';
import { getToken } from '../../utils/storage';

export default function Starred() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null);

  const loadFiles = async (idOverride) => {
    const targetId = idOverride || userId;
    if (targetId) {
        const data = await fetchGetAllFiles(targetId);
        if (data) {
            setFiles(data);
        }
    }
  };

  useEffect(() => {
    const init = async () => {
        const token = await getToken('token');
        if (token) {
            setUserId(token);
            loadFiles(token);
        }
    };
    init();
  }, []);

  // Filter: only files where the current user has starred it
  const starredFiles = files.filter(f => userId && f.star && f.star[userId] === true);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Starred Items</Text>
      
      <View style={styles.list}>
        {starredFiles.length > 0 ? (
          starredFiles.map((f) => {
            const directPerms = f.permissions ? f.permissions[userId] : undefined;
            const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;

            return (
              <File
                key={f.id}
                id={f.id}
                title={f.title}
                isStarred={true}
                creator={f.creator}
                type={f.type}
                canWrite={canWrite}
                onRefresh={loadFiles}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No starred items yet.</Text>
            <Text style={styles.subEmptyText}>Add stars to items you want to find easily later.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}