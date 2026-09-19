import React, { useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  Share,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const APP_URL = 'https://bcnvzn.com';

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
    // Inject native share support
    window.nativeShare = function(url, message) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'share', url, message }));
    };
    true;
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        onLoad={handleLoad}
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
        onShouldStartLoadWithRequest={(request) => {
          // Keep navigation inside the app, open external links in browser
          if (request.url.startsWith('https://bcnvzn.com') ||
              request.url.startsWith('about:') ||
              request.url.startsWith('blob:')) {
            return true;
          }
          return false;
        }}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
