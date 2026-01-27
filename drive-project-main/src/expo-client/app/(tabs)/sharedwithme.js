import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/sharedwithme.styles';

export default function SharedWithMe() {
  const [files, setFiles] = useState([]);
  const userId = localStorage.getItem('token');

  const loadFiles = async () => {
    const data = await fetchGetAllFiles(userId);
    if (data) {
        setFiles(data);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Filter: creator !== userId
  const sharedFiles = files.filter(f => String(f.creator) !== String(userId));

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