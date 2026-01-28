import { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [image, setImage] = useState(null);
    const router = useRouter();

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleRegister = async () => {
        if (!username || !password || !fullName) {
            Alert.alert("Error", "All fields are required");
            return;
        }
        
        // Strict Regex: Letters AND Numbers
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            Alert.alert("Invalid Password", "Password must be at least 8 chars with letters and numbers.");
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:5000/api/users', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    fullName,
                    profileImage: image
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Registered successfully!");
                router.replace('/login');
            } else {
                Alert.alert("Registration Failed", data.error || "Unknown error");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to connect to server");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}><Text>Add Photo</Text></View>
                )}
            </TouchableOpacity>
            <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
            <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Register" onPress={handleRegister} />
            <Button title="Back to Login" onPress={() => router.back()} color="gray" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    imageContainer: { alignSelf: 'center', marginBottom: 20 },
    image: { width: 100, height: 100, borderRadius: 50 },
    placeholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }
});