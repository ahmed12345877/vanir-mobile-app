import { companyContent } from '../content/companyContent';

export type BookingVertical = 'packages' | 'flights' | 'hotels';

export type TravelerDetails = {
  guestName: string;
  guestEmail: string;
  adults: string;
  children: string;
  dateFrom: string;
  dateTo: string;
  specialRequests: string;
};

export type FlightSelection = {
  origin: string;
  destination: string;
  cabin: string;
  departureDate: string;
  returnDate: string;
};

export type HotelSelection = {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
};

export type PackageSelection = {
  travelStyle: string;
};

export type BookingDraft = {
  vertical: BookingVertical;
  selectedId: string;
  traveler: TravelerDetails;
  flight: FlightSelection;
  hotel: HotelSelection;
  packageForm: PackageSelection;
};

export function getBookingCatalog(vertical: BookingVertical) {
  if (vertical === 'flights') {
    return companyContent.flights;
  }

  if (vertical === 'hotels') {
    return companyContent.hotels;
  }

  return companyContent.packages;
}

export function getBookingItemLabel(vertical: BookingVertical, selectedId: string) {
  if (vertical === 'flights') {
    const item = companyContent.flights.find(entry => entry.id === selectedId);
    if (!item) {
      return 'Custom travel request';
    }
    return `${item.airline} · ${item.route}`;
  }

  if (vertical === 'hotels') {
    const item = companyContent.hotels.find(entry => entry.id === selectedId);
    if (!item) {
      return 'Custom travel request';
    }
    return `${item.name} · ${item.location}`;
  }

  const item = companyContent.packages.find(entry => entry.title === selectedId);
  if (!item) {
    return 'Custom travel request';
  }

  return item.title;
}

export function getBookingItemId(vertical: BookingVertical, item: (typeof companyContent.flights)[number] | (typeof companyContent.hotels)[number] | (typeof companyContent.packages)[number]) {
  if (vertical === 'flights') {
    return (item as (typeof companyContent.flights)[number]).id;
  }

  if (vertical === 'hotels') {
    return (item as (typeof companyContent.hotels)[number]).id;
  }

  return (item as (typeof companyContent.packages)[number]).title;
}

export function composeBookingPayload(draft: BookingDraft) {
  const itemLabel = getBookingItemLabel(draft.vertical, draft.selectedId);
  const detailLines = [
    `Booking vertical: ${draft.vertical}`,
    `Selected offer: ${itemLabel}`,
    `Adults: ${Number(draft.traveler.adults) || 1}`,
    `Children: ${Number(draft.traveler.children) || 0}`,
    draft.traveler.dateFrom ? `Date from: ${draft.traveler.dateFrom}` : null,
    draft.traveler.dateTo ? `Date to: ${draft.traveler.dateTo}` : null,
    draft.vertical === 'flights' ? `Flight origin: ${draft.flight.origin}` : null,
    draft.vertical === 'flights' ? `Flight destination: ${draft.flight.destination}` : null,
    draft.vertical === 'flights' ? `Cabin: ${draft.flight.cabin}` : null,
    draft.vertical === 'flights' ? `Departure date: ${draft.flight.departureDate}` : null,
    draft.vertical === 'flights' ? `Return date: ${draft.flight.returnDate}` : null,
    draft.vertical === 'hotels' ? `Hotel city: ${draft.hotel.city}` : null,
    draft.vertical === 'hotels' ? `Check-in: ${draft.hotel.checkIn}` : null,
    draft.vertical === 'hotels' ? `Check-out: ${draft.hotel.checkOut}` : null,
    draft.vertical === 'hotels' ? `Rooms: ${draft.hotel.rooms}` : null,
    draft.vertical === 'packages' ? `Travel style: ${draft.packageForm.travelStyle}` : null,
    draft.traveler.specialRequests ? `Special requests: ${draft.traveler.specialRequests}` : null,
  ].filter(Boolean);

  return {
    packageName: itemLabel,
    guestName: draft.traveler.guestName,
    guestEmail: draft.traveler.guestEmail,
    adults: Number(draft.traveler.adults) || 1,
    paymentMethod: 'credit_card',
    currency: 'USD',
    specialRequests: detailLines.join('\n'),
  };
}

export function createInitialDraft(): BookingDraft {
  return {
    vertical: 'packages',
    selectedId: companyContent.packages[0]?.title ?? '',
    traveler: {
      guestName: '',
      guestEmail: '',
      adults: '2',
      children: '0',
      dateFrom: '',
      dateTo: '',
      specialRequests: '',
    },
    flight: {
      origin: 'London Heathrow',
      destination: 'Cairo',
      cabin: 'Business Class',
      departureDate: '',
      returnDate: '',
    },
    hotel: {
      city: 'Cairo',
      checkIn: '',
      checkOut: '',
      rooms: '1',
    },
    packageForm: {
      travelStyle: 'Private luxury',
    },
  };
}