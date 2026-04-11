import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import { RootNavigator } from './src/router';
import ToastContainer from './src/components/ToastContainer';
import Colors from './src/utils/colors';
import { deepLinkConfig } from './src/utils/deepLinkConfig';

import Fonts from './src/utils/fonts';

// Suppress specific non-critical warnings in dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate`',
]);

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer linking={deepLinkConfig} theme={navigationTheme}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.background}
              translucent={false}
            />
            <RootNavigator />
            {/* Global Toast Layer — sits above everything */}
            <ToastContainer />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

// ─── Navigation Theme ─────────────────────────────────────────────────────────
const navigationTheme = {
  dark: true,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.backgroundCard,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.primary,
  },
  fonts: {
    regular: {
      fontFamily: Fonts.Regular,
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: Fonts.Medium,
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: Fonts.Bold,
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: Fonts.Bold,
      fontWeight: '800' as const,
    },
  },
};

export default App;