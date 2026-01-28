import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { fetchGetAllTrashedFiles, fetchRestoreFile, fetchPermanentDeleteFile } from '../../fetches';
import { styles } from '../../styles/trash.styles';

export default function Trash() {
  const [files, setFiles] = useState([]);
  const userId = localStorage.getItem('token');

  const loadFiles = async () => {
    const data = await fetchGetAllTrashedFiles(userId);
    if (data) {
        setFiles(data);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleRestore = async (fileId) => {
    await fetchRestoreFile(fileId, userId);
    loadFiles();
  };

  const handlePermanentDelete = async (fileId) => {
      await fetchPermanentDeleteFile(fileId, userId);
      loadFiles();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Trash</Text>
      
      <View style={styles.list}>
        {files.length > 0 ? (
          files.map((f) => (
            <View key={f.id} style={styles.trashRow}>
              <View style={styles.infoArea}>
                <Text style={styles.icon}>{f.type === 'folder' ? '📁' : '📄'}</Text>
                <Text style={styles.fileTitle} numberOfLines={1}>{f.title}</Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.btn, styles.restoreBtn]} 
                  onPress={() => handleRestore(f.id)}
                >
                  <Text style={styles.restoreText}>Restore</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btn, styles.deleteBtn]} 
                  onPress={() => handlePermanentDelete(f.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Trash is empty</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}