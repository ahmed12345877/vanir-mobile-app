export type CompanyService = {
  title: string;
  description: string;
  icon: 'booking' | 'reviews' | 'signIn' | 'imageOff';
};

export type CompanyDestination = {
  name: string;
  region: string;
  travelers: string;
  category: string;
  imageUrl: string;
};

export type CompanyPackage = {
  title: string;
  region: string;
  price: string;
  duration: string;
  rating: string;
  category: string;
  imageUrl: string;
  summary?: string;
  includes?: readonly string[];
};

export type CompanyFlightOffer = {
  id: string;
  airline: string;
  route: string;
  cabin: string;
  price: string;
  schedule: string;
  baggage: string;
  imageUrl: string;
  seatOptions: readonly string[];
  baggageOptions: readonly string[];
  cabinOptions: readonly string[];
};

export type CompanyHotelOffer = {
  id: string;
  name: string;
  location: string;
  nightlyRate: string;
  stars: string;
  boardType: string;
  imageUrl: string;
  highlights: readonly string[];
  roomTypes: readonly string[];
  mealPlans: readonly string[];
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
  highlights: readonly string[];
};

export type CompanyArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  imageUrl: string;
};

export type CompanyTestimonial = {
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarUrl: string;
};

export type CompanyGalleryItem = {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
};

export const companyContent = {
  brand: 'VANIR GROUP',
  tagline: 'Luxury travel with curated experiences, private journeys, and premium service.',
  heroTitle: 'We Are Your Gateway to Adventure',
  heroBody:
    'From private Nile cruises to bespoke cultural tours across Egypt and beyond, VANIR GROUP crafts secure, personalized travel experiences end-to-end.',
  stats: [
    { label: 'Happy Travelers', value: '15K+' },
    { label: 'Destinations', value: '200+' },
    { label: 'Awards Won', value: '50+' },
    { label: 'Countries', value: '30+' },
  ],
  services: [
    {
      title: 'Personalized Itineraries',
      description: 'Custom travel plans curated after sign-in and shaped around your preferred pace, style, and budget.',
      icon: 'booking',
    },
    {
      title: 'Booking Management',
      description: 'View, modify, and track luxury tour bookings in one place with a cleaner mobile workflow.',
      icon: 'reviews',
    },
    {
      title: 'Exclusive Offers',
      description: 'Unlock member-only deals, early-access packages, and VIP experiences from the same VANIR promotions.',
      icon: 'signIn',
    },
    {
      title: 'Secure & Private',
      description: 'Google Sign-In is used only to verify identity. Your account and session remain protected.',
      icon: 'imageOff',
    },
    {
      title: 'Airport Transfer Concierge',
      description: 'Pre-book private airport pickup with flight tracking and direct transfer to your hotel or cruise.',
      icon: 'booking',
    },
    {
      title: 'VIP Lounge & Meet Assist',
      description: 'Add lounge access and fast-track airport assistance as a premium travel add-on from the app.',
      icon: 'reviews',
    },
  ] satisfies CompanyService[],
  destinations: [
    {
      name: 'Egypt',
      region: 'Ancient Wonders',
      travelers: '174,688 Travelers',
      category: 'City Tours',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/3KuxuyE2.png',
    },
    {
      name: 'Sharm El Sheikh',
      region: 'Red Sea Escape',
      travelers: '98,420 Travelers',
      category: 'Luxury Hotels',
      imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/hero-bg-YvjFWtPTFizkPySUcokQvt.webp',
    },
    {
      name: 'Luxor',
      region: 'Timeless Heritage',
      travelers: '65,320 Travelers',
      category: 'Branding',
      imageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500&h=600&fit=crop',
    },
    {
      name: 'United Kingdom',
      region: 'Classic Europe',
      travelers: '174,688 Travelers',
      category: 'Featured',
      imageUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop',
    },
  ] satisfies CompanyDestination[],
  packages: [
    {
      title: 'Cairo & Nile Signature Escape',
      region: 'Cairo, Luxor, Aswan',
      price: '$1,480 / traveler',
      duration: '6 nights',
      rating: '4.9',
      category: 'Luxury Package',
      imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=1200&h=800&fit=crop',
      summary: 'Private airport welcome, Nile cruise cabin, and guided temple access in one premium itinerary.',
      includes: ['Airport transfers', '5-star cruise', 'Private Egyptologist guide'],
    },
    {
      title: 'Red Sea Resort Retreat',
      region: 'Sharm El Sheikh',
      price: '$920 / traveler',
      duration: '4 nights',
      rating: '4.8',
      category: 'Beach Package',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
      summary: 'Beachfront stay, diving add-ons, and private concierge support for couples and families.',
      includes: ['Breakfast & dinner', 'Airport pickup', 'Snorkeling cruise'],
    },
    {
      title: 'Alexandria Heritage Weekend',
      region: 'Alexandria, Egypt',
      price: '$540 / traveler',
      duration: '3 nights',
      rating: '4.7',
      category: 'City Break',
      imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop',
      summary: 'Boutique hotel stay with library tour, corniche dinner reservation, and chauffeured transfers.',
      includes: ['Boutique hotel', 'City transfers', 'Guided old-town walk'],
    },
    {
      title: 'Siwa Wellness Discovery',
      region: 'Siwa Oasis',
      price: '$1,120 / traveler',
      duration: '5 nights',
      rating: '4.9',
      category: 'Wellness Package',
      imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop',
      summary: 'Eco-lodge accommodation, desert sunset dinners, and curated wellness sessions in Siwa.',
      includes: ['Eco-lodge stay', 'Salt lake visit', 'Private safari dinner'],
    },
  ] satisfies CompanyPackage[],
  flights: [
    {
      id: 'MS-LHR-CAI-BIZ',
      airline: 'EgyptAir',
      route: 'London Heathrow to Cairo',
      cabin: 'Business Class',
      price: '$1,180 round trip',
      schedule: 'Daily departure · 5h 20m',
      baggage: '2 checked bags + lounge access',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=800&fit=crop',
      seatOptions: ['Window', 'Aisle', 'Extra legroom aisle', 'Bulkhead'],
      baggageOptions: ['1 cabin bag', '2 checked bags', 'Sports equipment'],
      cabinOptions: ['Business Class', 'Premium Economy'],
    },
    {
      id: 'EK-DXB-SSH-ECO',
      airline: 'Emirates',
      route: 'Dubai to Sharm El Sheikh',
      cabin: 'Economy Flex',
      price: '$540 round trip',
      schedule: '4 departures weekly · 3h 45m',
      baggage: '30kg checked bag',
      imageUrl: 'https://images.unsplash.com/photo-1540339832862-474599807836?w=1200&h=800&fit=crop',
      seatOptions: ['Window', 'Aisle', 'Front cabin'],
      baggageOptions: ['20kg checked bag', '30kg checked bag', 'Extra bag'],
      cabinOptions: ['Economy Flex', 'Business Class'],
    },
    {
      id: 'TK-IST-LXR-PRE',
      airline: 'Turkish Airlines',
      route: 'Istanbul to Luxor',
      cabin: 'Premium Economy',
      price: '$690 round trip',
      schedule: '3 departures weekly · 4h 55m',
      baggage: '23kg checked bag + priority boarding',
      imageUrl: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=1200&h=800&fit=crop',
      seatOptions: ['Window', 'Aisle', 'Exit row'],
      baggageOptions: ['23kg checked bag', '2x23kg checked bags'],
      cabinOptions: ['Premium Economy', 'Business Class'],
    },
  ] satisfies readonly CompanyFlightOffer[],
  hotels: [
    {
      id: 'st-regis-cairo',
      name: 'The St. Regis Cairo',
      location: 'Cairo Corniche',
      nightlyRate: '$420 / night',
      stars: '5-star',
      boardType: 'Breakfast included',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
      highlights: ['River-view suite', 'Private butler', 'Spa access'],
      roomTypes: ['Deluxe King', 'River Suite', 'St. Regis Suite'],
      mealPlans: ['Room only', 'Breakfast included', 'Half board'],
    },
    {
      id: 'rixos-sharm',
      name: 'Rixos Premium Seagate',
      location: 'Sharm El Sheikh',
      nightlyRate: '$360 / night',
      stars: '5-star',
      boardType: 'All inclusive',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop',
      highlights: ['Beachfront resort', 'Family waterpark', 'Airport transfer'],
      roomTypes: ['Deluxe Garden Room', 'Swim-Up Room', 'Family Suite'],
      mealPlans: ['All inclusive', 'Premium all inclusive'],
    },
    {
      id: 'sofitel-winter-palace',
      name: 'Sofitel Winter Palace Luxor',
      location: 'Luxor',
      nightlyRate: '$275 / night',
      stars: '5-star heritage',
      boardType: 'Room only or breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop',
      highlights: ['Historic palace', 'Garden pool', 'Walk to Luxor Temple'],
      roomTypes: ['Classic Room', 'Nile View Room', 'Palace Suite'],
      mealPlans: ['Room only', 'Breakfast included'],
    },
  ] satisfies readonly CompanyHotelOffer[],
  travelEssentials: [
    {
      id: 'visa-egypt-priority',
      category: 'Visa',
      title: 'Egypt Priority Visa Assistance',
      provider: 'VANIR Travel Desk',
      price: '$79 / traveler',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop',
      summary: 'Fast document checklist, application review, and airport-entry readiness support for Egypt-bound travelers.',
      highlights: ['Checklist review', 'Priority document audit', 'Arrival support notes'],
    },
    {
      id: 'esim-global-10gb',
      category: 'eSIM',
      title: 'Global Travel eSIM 10GB',
      provider: 'Airalo Partner Lane',
      price: '$24',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
      summary: 'Data-ready eSIM for Egypt and nearby destinations with instant QR activation after checkout.',
      highlights: ['Instant QR activation', '10GB data plan', 'Regional roaming ready'],
    },
    {
      id: 'esim-unlimited-premium',
      category: 'eSIM',
      title: 'Premium eSIM Unlimited Plus',
      provider: 'VANIR Connectivity Desk',
      price: '$52',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
      summary: 'Unlimited data plan with priority network profile and concierge support for longer stays.',
      highlights: ['Unlimited data', 'Priority routing profile', '24/7 activation support'],
    },
    {
      id: 'insurance-premium-multi',
      category: 'Insurance',
      title: 'Premium Multi-Trip Insurance',
      provider: 'Allianz Travel Partner',
      price: '$118 / policy',
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop',
      summary: 'Medical cover, baggage delay protection, and cancellation support for high-value itineraries.',
      highlights: ['Emergency medical cover', 'Trip cancellation', 'Baggage delay protection'],
    },
    {
      id: 'insurance-vip-complete',
      category: 'Insurance',
      title: 'VIP Complete Travel Protection',
      provider: 'VANIR Shield Partners',
      price: '$164 / policy',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop',
      summary: 'Extended medical, missed-connection cover, and dedicated assistance hotlines in your destination.',
      highlights: ['Higher emergency limits', 'Missed connection cover', 'Priority claim support'],
    },
  ] satisfies readonly TravelEssentialItem[],
  testimonials: [
    {
      name: 'Lucas Thompson',
      role: 'Travel Blogger & Photographer',
      location: 'London, UK',
      quote:
        'The trip was absolutely phenomenal. Every detail was carefully planned, from the luxury accommodations to the breathtaking excursions.',
      avatarUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/avatar-lucas-SB2YyXpuVDW6oUtM3i9jSs.webp',
    },
    {
      name: 'Benjamin Carter',
      role: 'Business Executive',
      location: 'Dubai, UAE',
      quote:
        'VANIR made luxury travel feel effortless. The itinerary, support, and local knowledge were all world-class.',
      avatarUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/avatar-benjamin-gpYWFYEDFEziuuNCsPo66v.webp',
    },
    {
      name: 'Ahmed Roshdi',
      role: 'Family Traveler',
      location: 'Cairo, Egypt',
      quote:
        'The app feels like a private travel desk in my pocket. Easy, clean, and clearly built around premium experiences.',
      avatarUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/avatar-ahmed-W3AJmXi7maBfaB8mVbScYN.webp',
    },
  ] satisfies CompanyTestimonial[],
  articles: [
    {
      slug: 'ultimate-guide-pyramids-of-giza',
      title: 'Discover the Ancient Wonders of Egypt',
      excerpt: 'Explore the timeless beauty of pyramids, temples, and the Nile River on an unforgettable journey.',
      publishedAt: 'Mar 15, 2026',
      readingTime: '6 min read',
      imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/destination-egypt-YcosuhKLMYbaJ475QVrVxy.webp',
    },
    {
      slug: 'luxury-nile-cruise-experience',
      title: 'Luxury Nile Cruise: A Journey Through Ancient Egypt\'s Heart',
      excerpt: 'Discover why a Nile cruise remains the most enchanting way to explore Egypt.',
      publishedAt: 'Mar 10, 2026',
      readingTime: '5 min read',
      imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=600&h=400&fit=crop',
    },
    {
      slug: 'top-10-egypt-travel-tips-2026',
      title: 'Top 10 Essential Egypt Travel Tips',
      excerpt: 'Planning your first trip to Egypt? These essential tips will help you navigate culture, currency, and more.',
      publishedAt: 'Mar 05, 2026',
      readingTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    },
  ] satisfies CompanyArticle[],
  gallery: [
    {
      title: 'Luxor Temple',
      category: 'Luxury Hotels',
      description: 'The majestic columns of Luxor Temple at sunset',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/SPVMr9Jt.jpg',
    },
    {
      title: 'Blue Domes and Sunset Views',
      category: 'Luxury Hotels',
      description: 'Discover the ultimate romantic island.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/i6fhidWU.jpg',
    },
    {
      title: 'Great Sphinx',
      category: 'Branding',
      description: 'The Great Sphinx, a silent witness to ancient civilization.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/lFtuM0SX.jpg',
    },
    {
      title: 'Siwa Oasis',
      category: 'City Tours',
      description: 'The natural beauty and tranquility of Siwa Oasis.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/b2s4PG1O.jpg',
    },
    {
      title: 'Unveiling the Wonders',
      category: 'Desert Safari',
      description: 'A destination that captivates the imagination.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/w8CpdbfU.jpg',
    },
    {
      title: 'Giza Pyramids',
      category: 'Historical',
      description: 'The timeless Great Pyramids of Giza under a clear sky.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/oZtuAS95.jpeg',
    },
    {
      title: 'Nile Felucca',
      category: 'Nile Cruises',
      description: 'A peaceful journey on a traditional Felucca boat in the Nile.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/pQv2UFj0.jpg',
    },
    {
      title: 'Honeymoon',
      category: 'City Tours',
      description: 'Romantic travel inspiration from the current VANIR gallery.',
      imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/qVMcBdWb.jpg',
    },
  ] satisfies CompanyGalleryItem[],
  contact: {
    address: '203 Salah Salem, SET, Cairo, Egypt',
    email: 'info@vanirgroup.com',
    phone: '+201123988882',
    website: 'https://vanirgroup.com',
    privacyPolicy: 'https://vanirgroup.com/privacy-policy',
    termsOfService: 'https://vanirgroup.com/terms-of-service',
    loginUrl: 'https://vanirgroup.com/login',
  },
} as const;