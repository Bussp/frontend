import { LineItem } from '@/app/components/BottomSheetMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@recent_searches';

export async function getRecentSearches(): Promise<LineItem[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addSearch(query: LineItem) {
  let searches = await getRecentSearches();

  searches = searches.filter(
    item =>
      !(
        item.line === query.line &&
        item.terminal === query.terminal &&
        item.direction === query.direction
      )
  );

  searches.unshift(query);

  if (searches.length > 5) {
    searches = searches.slice(0, 5);
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));

  return searches;
}
