import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import File from '../../components/File';
import { fetchSearchFiles } from '../../fetches';
import { styles } from '../../styles/search.styles';

export default function Search() {
  const { q: query } = useLocalSearchParams();
  const [files, setFiles] = useState([]);
  const userId = localStorage.getItem('token');

  const loadFiles = async () => {
    if (!query) return;
    const data = await fetchSearchFiles(userId, query);
    if (data) {
        setFiles(data);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [query]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        {query ? `Search Results for "${query}"` : 'Enter a search term'}
      </Text>
      
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
                canWrite={canWrite}
                onRefresh={loadFiles}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {query ? 'No results found.' : 'Your results will appear here.'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}