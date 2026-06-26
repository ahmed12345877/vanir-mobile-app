import { appConfig } from '../config/appConfig';

export type FlightSearchInput = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  cabin: string;
};

export type HotelSearchInput = {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
};

export type FlightOffer = {
  id: string;
  airline: string;
  route: string;
  cabin: string;
  price: string;
  schedule: string;
  baggage: string;
  imageUrl: string;
  seatOptions: string[];
  baggageOptions: string[];
  cabinOptions: string[];
};

export type HotelOffer = {
  id: string;
  name: string;
  location: string;
  nightlyRate: string;
  stars: string;
  boardType: string;
  imageUrl: string;
  highlights: string[];
  roomTypes: string[];
  mealPlans: string[];
};

export type TravelEssentialCategory = 'Visa' | 'eSIM' | 'Insurance';

export type TravelEssentialItem = {
  id: string;
  category: TravelEssentialCategory;
  title: string;
  provider: string;
  price: string;
  imageUrl: string;
  summary: string;
  highlights: string[];
};

export type TravelEssentialsCheckoutRequest = {
  category: TravelEssentialCategory;
  itemId: string;
  travelerName: string;
  email: string;
  countryOfResidence?: string;
  passportNumber?: string;
  passportExpiry?: string;
  documentReferences?: string;
  phoneNumber?: string;
  activationDevice?: string;
  destination?: string;
  coverageStart?: string;
  coverageEnd?: string;
  emergencyContact?: string;
  notes?: string;
};

export type TravelBookingRequest = {
  offerId: string;
  guestName: string;
  guestEmail: string;
  adults: number;
  children: number;
  dates: {
    from: string;
    to: string;
  };
  details: Record<string, unknown>;
  specialRequests?: string;
};

type SearchFlightsResponse = { offers: FlightOffer[] };
type SearchHotelsResponse = { offers: HotelOffer[] };
type TravelEssentialsResponse = { items: TravelEssentialItem[] };
type TravelEssentialsCheckoutResponse = {
  confirmationCode: string;
  status: string;
  activationCode?: string;
  policyNumber?: string;
  visaCaseNumber?: string;
};
type BookingResponse = { confirmationCode: string; status: string };

function travelApiUrl(path: string) {
  const normalizedBase = appConfig.travelApiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function postTravelJson<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
  const response = await fetch(travelApiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Travel request failed.');
  }

  return payload;
}

export async function searchFlights(input: FlightSearchInput) {
  const response = await postTravelJson<SearchFlightsResponse>('/api/mobile/flights/search', input);
  return response.offers;
}

export async function searchHotels(input: HotelSearchInput) {
  const response = await postTravelJson<SearchHotelsResponse>('/api/mobile/hotels/search', input);
  return response.offers;
}

export async function getTravelEssentials(category?: TravelEssentialCategory) {
  const response = await postTravelJson<TravelEssentialsResponse>('/api/mobile/travel-essentials/list', { category });
  return response.items;
}

export async function checkoutTravelEssentials(request: TravelEssentialsCheckoutRequest) {
  return postTravelJson<TravelEssentialsCheckoutResponse>('/api/mobile/travel-essentials/checkout', request);
}

export async function bookFlight(request: TravelBookingRequest) {
  return postTravelJson<BookingResponse>('/api/mobile/flights/book', request);
}

export async function bookHotel(request: TravelBookingRequest) {
  return postTravelJson<BookingResponse>('/api/mobile/hotels/book', request);
}