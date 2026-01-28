import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/TopMenu.styles';

const TopMenu = ({ darkMode, setDarkMode }) => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Keep original localStorage logic for Web
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:5000/api/users/${token}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // window.location.reload() works on web to reset the app state
    window.location.reload(); 
  };

  return (
    <View style={styles.navBar}>
      {/* Brand */}
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.brandText}>Drive</Text>
      </TouchableOpacity>

      {/* Form (Search) */}
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Nav Actions */}
      <View style={styles.navRight}>
        <TouchableOpacity 
          style={styles.themeBtn} 
          onPress={() => setDarkMode(!darkMode)}
        >
          <Text style={styles.themeBtnText}>{darkMode ? 'Light' : 'Dark'}</Text>
        </TouchableOpacity>

        {user && (
          <View style={styles.userSection}>
            <Image 
              source={{ uri: user.image }} 
              style={styles.userImage} 
            />
            <Text style={styles.userName}>{user.fullName}</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default TopMenu;