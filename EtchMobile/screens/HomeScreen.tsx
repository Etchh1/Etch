import { StyleSheet, Text, View } from 'react-native';
import { useFeatureFlag, useConfigValue } from '../lib/statsig';

export default function HomeScreen() {
  const isNewFeatureEnabled = useFeatureFlag('new_feature');
  const config = useConfigValue('app_config');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Etch Mobile</Text>
      <Text>Feature Flag Status: {isNewFeatureEnabled ? 'Enabled' : 'Disabled'}</Text>
      <Text>Config Value: {JSON.stringify(config, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 