import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/index.styles';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

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

  const handleNavigate = (folderId) => {
    setCurrentFolder(folderId);
  };

  const handleBack = () => {
    if (currentFolder === null) return;
    const currentFolderObj = files.find(f => f.id === currentFolder);
    if (currentFolderObj) {
      setCurrentFolder(currentFolderObj.dir);
    } else {
      setCurrentFolder(null);
    }
  };

  const filteredFiles = files.filter(f => f.dir === currentFolder);

  return (
    <ScrollView style={styles.container}>
      {/* 1. Breadcrumb / Back Button logic */}
      {currentFolder !== null && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.folderTitle}>
            {files.find(f => f.id === currentFolder)?.title || 'Folder'}
          </Text>
        </View>
      )}

      {/* 2. The List (replaces ListGroup) */}
      <View style={styles.list}>
        {filteredFiles.length > 0 ? (
          filteredFiles.map((f) => {
            // Permission Logic
            const directPerms = f.permissions ? f.permissions[userId] : undefined;
            const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;

            return (
              <File
                key={f.id}
                id={f.id}
                title={f.title}
                type={f.type}
                isStarred={!!f.star?.[userId]}
                creator={f.creator}
                canWrite={canWrite}
                onNavigate={handleNavigate}
                onRefresh={loadFiles}
                date={f.date} // Passing date for the list view
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>This folder is empty.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}