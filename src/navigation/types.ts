export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Booking: undefined;
  PackageBooking: undefined;
  FlightBooking: undefined;
  HotelBooking: undefined;
  TravelEssentials: undefined;
  UnifiedCheckout: undefined;
  AIStudio: undefined;
  LegalCenter: undefined;
  Reviews: undefined;
  Contact: { channel?: 'booking' | 'call' | 'whatsapp' | 'email' } | undefined;
  BlogPost: { slug: string; title: string };
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Offers: undefined;
  AIStudio: undefined;
  Profile: undefined;
};
