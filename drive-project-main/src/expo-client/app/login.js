import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveToken } from '../utils/storage';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5000/api/tokens', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                await saveToken('token', data.token);
                router.replace('/(tabs)'); 
            } else {
                Alert.alert("Error", data.error || "Login failed");
            }
        } catch (e) {
            Alert.alert("Connection Error", "Check server IP");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput placeholder="Username" style={styles.input} onChangeText={setUsername} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => router.push('/register')} color="gray" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});