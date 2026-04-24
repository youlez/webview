import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text, RefreshControl, ScrollView, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0dcaf0"
              title="Recargando..."
              titleColor="#0dcaf0"
            />
          }
        >
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://react-ten-olive.vercel.app/' }}
            onNavigationStateChange={handleNavigationStateChange}
            style={styles.webView}
            onLoadEnd={() => setRefreshing(false)}
            startInLoadingState={false}
            renderLoading={() => null}
          />
        </ScrollView>

        {/* BARRA DE NAVEGACIÓN INFERIOR - Estilo Nexus */}
        <View style={styles.navigationBar}>
          <Pressable
            onPress={goBack}
            style={[styles.button, !canGoBack && styles.buttonDisabled]}
            disabled={!canGoBack}
          >
            <Text style={[styles.buttonText, !canGoBack && styles.buttonTextDisabled]}>
              ← Atrás
            </Text>
          </Pressable>

          <Pressable
            onPress={reload}
            style={styles.button}
          >
            <Text style={styles.buttonText}>⟳ Recargar</Text>
          </Pressable>

          <Pressable
            onPress={goForward}
            style={[styles.button, !canGoForward && styles.buttonDisabled]}
            disabled={!canGoForward}
          >
            <Text style={[styles.buttonText, !canGoForward && styles.buttonTextDisabled]}>
              Adelante →
            </Text>
          </Pressable>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cff4fc', 
  },
  // ✅ NAVBAR SUPERIOR CON LOGO (igual que tu Menu.jsx)
  navbar: {
    height: 60,
    backgroundColor: '#cff4fc', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  scrollViewContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  // ✅ BARRA INFERIOR (misma estructura que el original, colores Nexus)
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#cff4fc',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#9eeaf9',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0dcaf0',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd', // gris Bootstrap
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#6c757d',
  },
});