import type { SearchParams } from '../components/SearchCard';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Booking: undefined;
  Reviews: undefined;
  BlogPost: { slug: string; title: string };
  AIStudio: undefined;
  SearchResults: { params?: SearchParams };
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Offers: undefined;
  Blog: undefined;
  Profile: undefined;
};
