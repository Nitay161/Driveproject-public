import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ 
          headerShown: true,
          drawerActiveTintColor: '#3b82f6',
      }}>
        {/* Main Files Screen */}
        <Drawer.Screen 
          name="(tabs)" 
          options={{ 
            drawerLabel: 'Home', 
            title: 'My Drive',
            drawerIcon: ({size, color}) => <Ionicons name="home-outline" size={size} color={color} />
          }} 
        />
        
        {/* Hidden Authentication Screens */}
        <Drawer.Screen 
          name="login" 
          options={{ 
             drawerItemStyle: { display: 'none' },
             headerShown: false,
             swipeEnabled: false
          }} 
        />
        <Drawer.Screen 
          name="register" 
          options={{ 
             drawerItemStyle: { display: 'none' },
             headerShown: false,
             swipeEnabled: false
          }} 
        />
        
        {/* Hidden Utility Screens */}
        <Drawer.Screen 
          name="move/[id]" 
          options={{ 
             drawerItemStyle: { display: 'none' },
             title: 'Move File'
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}