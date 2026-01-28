import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import File from '../../components/File';
import { fetchGetAllFiles } from '../../fetches';
import { styles } from '../../styles/recent.styles';
import { getToken } from '../../utils/storage';

export default function Recent() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null); // שינוי ל-State
  const NUMBER_OF_RECENT_FILES = 10;

  // עדכון הפונקציה שתקבל ID אופציונלי
  const loadFiles = async (idOverride) => {
    const targetId = idOverride || userId;
    if (targetId) {
        const data = await fetchGetAllFiles(targetId);
        if (data) {
            let filteredData = data.filter(f => f.type === 'file');
            filteredData.sort((a, b) => new Date(b.last) - new Date(a.last));
            setFiles(filteredData.slice(0, NUMBER_OF_RECENT_FILES));
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