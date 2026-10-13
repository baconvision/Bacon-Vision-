import React, { useRef, useState } from 'react';
import { StatusBar, StyleSheet, ActivityIndicator, View, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const APP_URL = 'https://bcnvzn.com';

export function allowAppNavigation(url: string): boolean {
  // Keep embedded Stripe checkout inside the app; reject lookalike hosts.
  if (url === 'about:blank' || url === 'about:srcdoc') return true;
  if (/^blob:https:\/\/bcnvzn\.com\//i.test(url)) return true;
  return /^https:\/\/bcnvzn\.com(?::443)?(?:[/?#]|$)/i.test(url) ||
    /^https:\/\/(?:[a-z0-9-]+\.)*stripe\.com(?::443)?(?:[/?#]|$)/i.test(url);
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const handleLoad = () => {
    setLoading(false);
    SplashScreen.hideAsync();
  };
  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'share' && data.url) {
        await Share.share({ url: data.url, message: data.message || '' });
      }
    } catch {}
  };
  const injectedJS = `
    window.nativeShare = function(url, message) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'share', url, message }));
    };
    true;
  `;
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        contentInsetAdjustmentBehavior="never"
        onLoad={handleLoad}
        onLoadEnd={handleLoad}
        onMessage={handleMessage}
        injectedJavaScript={injectedJS}
        pullToRefreshEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        allowsFullscreenVideo
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) => allowAppNavigation(request.url)}
      />
      {loading && <View style={styles.loader}><ActivityIndicator size="large" color="#8b5cf6" /></View>}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  webview: { flex: 1, backgroundColor: '#0a0a0a' },
  loader: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
});

