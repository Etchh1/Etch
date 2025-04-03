import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useFeatureFlag, useConfigValue } from '../../lib/statsig';

export default function TabOneScreen() {
  const isNewFeatureEnabled = useFeatureFlag('new_feature');
  const config = useConfigValue<{ title: string }>('app_config') ?? { title: 'Default Title' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Etch Mobile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Feature Flag Status: {isNewFeatureEnabled ? 'Enabled' : 'Disabled'}</Text>
      <Text>Config Title: {config.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
