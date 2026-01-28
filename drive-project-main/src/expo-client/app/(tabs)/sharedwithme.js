import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/sharedwithme.styles';
import { getToken } from '../../utils/storage';

export default function SharedWithMe() {
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

  // Filter: creator !== userId
  const sharedFiles = files.filter(f => userId && String(f.creator) !== String(userId));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Shared With Me</Text>
      
      <View style={styles.list}>
        {sharedFiles.length > 0 ? (
          sharedFiles.map((f) => {
            const directPerms = f.permissions ? f.permissions[userId] : undefined;
            const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;

            return (
              <File
                key={f.id}
                id={f.id}
                title={f.title}
                isStarred={!!f.star?.[userId]}
                creator={f.creator}
                type={f.type}
                canWrite={canWrite}
                onRefresh={loadFiles}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No files have been shared with you yet.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}