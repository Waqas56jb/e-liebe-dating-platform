import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// App-wide safety net: if any screen throws while rendering, show a graceful
// fallback (with a Try again) instead of crashing the whole app.
export default class ErrorBoundary extends React.Component {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ hasError: false, message: '' });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.root}>
        <Text style={styles.emoji}>💔</Text>
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.msg}>Etwas ist schiefgelaufen. / Something went wrong.</Text>
        <Pressable style={styles.btn} onPress={this.reset}>
          <Text style={styles.btnText}>Erneut versuchen / Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1E0A2E', alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  msg: { color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  btn: { marginTop: 28, backgroundColor: '#FF6FAE', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
