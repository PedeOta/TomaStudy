import AsyncStorage from '@react-native-async-storage/async-storage';

const HTML_KEY = 'html_completed';

export async function markHtmlCompleted() {
  await AsyncStorage.setItem(HTML_KEY, 'true');
}

export async function isHtmlCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(HTML_KEY);
  return value === 'true';
}
