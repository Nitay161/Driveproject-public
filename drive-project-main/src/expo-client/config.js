import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    
    if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:5000`;
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000';
    }

    return 'http://localhost:5000';
}

const SERVER_URL = getBaseUrl();

export default SERVER_URL;