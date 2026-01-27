import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/recent.styles';

export default function Recent() {
  const [files, setFiles] = useState([]);
  const NUMBER_OF_RECENT_FILES = 10;
  const userId = localStorage.getItem('token') || "test_user_123";

  const loadFiles = async () => {
    const data = await fetchGetAllFiles(userId);
    if (data) {
        // filter to see only files and not folders
        let filteredData = data.filter(f => f.type === 'file');
        // sort by last edited descending   
        filteredData.sort((a, b) => new Date(b.last) - new Date(a.last));
        setFiles(filteredData.slice(0, NUMBER_OF_RECENT_FILES)); // get only top NUMBER_OF_RECENT_FILES recent files
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Recent Files</Text>
      
      <View style={styles.list}>
        {files.length > 0 ? (
          files.map((f) => {
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
                date={f.last}
                canWrite={canWrite}
                onRefresh={loadFiles}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent files found.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}