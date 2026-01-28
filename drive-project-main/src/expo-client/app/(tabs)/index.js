import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/index.styles';
import { getToken } from '../../utils/storage';

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const loadFiles = async (idOverride) => {
    const targetId = idOverride || userId;
    if (targetId) {
        try {
            const data = await fetchGetAllFiles(targetId);
            if (data && !data.error) {
                setFiles(data);
            } else {
                console.log("Server error or no data");
            }
        } catch (e) {
             console.log("Network error");
        }
    }
  };

  useEffect(() => {
    const init = async () => {
        const token = await getToken('token');
        
        if (!token) {
            router.replace('/login');
            return;
        }

        setUserId(token);
        loadFiles(token);
    };
    init();
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

      {/* 2. The List */}
      <View style={styles.list}>
        {filteredFiles.length > 0 ? (
          filteredFiles.map((f) => {
            const directPerms = (userId && f.permissions) ? f.permissions[userId] : undefined;
            const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;

            return (
              <File
                key={f.id}
                id={f.id}
                title={f.title}
                type={f.type}
                isStarred={!!(userId && f.star?.[userId])}
                creator={f.creator}
                canWrite={canWrite}
                onNavigate={handleNavigate}
                onRefresh={() => loadFiles(userId)}
                date={f.date}
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