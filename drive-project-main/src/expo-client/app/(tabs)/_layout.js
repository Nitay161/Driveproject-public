import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { styles } from '../../styles/tabs._layout.styles';
import TopMenu from '../../components/TopMenu';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#121212' : 'white' }}>
      
      {/* 1. TOP MENU COMPONENT */}
      <SafeAreaView style={{ backgroundColor: '#343a40' }} edges={['top']}>
        <TopMenu darkMode={darkMode} setDarkMode={setDarkMode} />
      </SafeAreaView>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        
        {/* 2. SIDEBAR */}
        <View style={[styles.sideMenuContainer, darkMode && { backgroundColor: '#1e1e1e', borderColor: '#333' }]}>
          <View style={styles.createButtonContainer}>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create')}>
              <Text style={styles.createButtonText}>+ Create</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Buttons */}
          <TouchableOpacity onPress={() => router.push('/')} style={[styles.navButton, isActive('/') && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isActive('/') && styles.navButtonTextActive, darkMode && { color: '#ccc' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/recent')} style={[styles.navButton, isActive('/recent') && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isActive('/recent') && styles.navButtonTextActive, darkMode && { color: '#ccc' }]}>Recent</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/sharedwithme')} style={[styles.navButton, isActive('/sharedwithme') && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isActive('/sharedwithme') && styles.navButtonTextActive, darkMode && { color: '#ccc' }]}>Shared With Me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/starred')} style={[styles.navButton, isActive('/starred') && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isActive('/starred') && styles.navButtonTextActive, darkMode && { color: '#ccc' }]}>Starred</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/trash')} style={[styles.navButton, isActive('/trash') && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isActive('/trash') && styles.navButtonTextActive, darkMode && { color: '#ccc' }]}>Trash</Text>
          </TouchableOpacity>
        </View>

        {/* 3. CONTENT AREA (The Navigator) */}
        <View style={{ flex: 1 }}>
          <Slot/>
        </View>

      </View>
    </View>
  );
}