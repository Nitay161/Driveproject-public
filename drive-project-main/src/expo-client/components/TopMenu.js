import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/TopMenu.styles';
import { getToken, deleteToken } from '../utils/storage';
import SERVER_URL from '../config';

const TopMenu = ({ darkMode, setDarkMode }) => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await getToken('token');
        
        if (token) {
          const response = await fetch(`${SERVER_URL}/api/users/${token}`);
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    
    getUser();
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  const handleLogout = async () => {
    await deleteToken('token');
    setUser(null);
    router.replace('/login');
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
            {user.image ? (
                <Image 
                source={{ uri: user.image }} 
                style={styles.userImage} 
                />
            ) : (
                <Text style={{color: 'white', marginRight: 5}}>User</Text>
            )}
            
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