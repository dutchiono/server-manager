import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ServerProvider } from './src/contexts/ServerContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { theme } from './src/utils/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <ServerProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </ServerProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}