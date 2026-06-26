import http from 'node:http';

const port = Number(process.env.PORT || 3001);

const flightOffers = [
  {
    id: 'MS-LHR-CAI-BIZ',
    airline: 'EgyptAir',
    route: 'London Heathrow to Cairo',
    cabin: 'Business Class',
    price: '$1,180 round trip',
    schedule: 'Daily departure · 5h 20m',
    baggage: '2 checked bags + lounge access',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/hero-bg-YvjFWtPTFizkPySUcokQvt.webp',
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
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/destination-sharm-Fh2PhqqrRQGfdg6EtwXedu.webp',
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
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/Uy3v8KBU.png',
    seatOptions: ['Window', 'Aisle', 'Exit row'],
    baggageOptions: ['23kg checked bag', '2x23kg checked bags'],
    cabinOptions: ['Premium Economy', 'Business Class'],
  },
];

const hotelOffers = [
  {
    id: 'st-regis-cairo',
    name: 'The St. Regis Cairo',
    location: 'Cairo',
    nightlyRate: '$420 / night',
    stars: '5-star',
    boardType: 'Breakfast included',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/i6fhidWU.jpg',
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
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/destination-sharm-Fh2PhqqrRQGfdg6EtwXedu.webp',
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
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/SPVMr9Jt.jpg',
    highlights: ['Historic palace', 'Garden pool', 'Walk to Luxor Temple'],
    roomTypes: ['Classic Room', 'Nile View Room', 'Palace Suite'],
    mealPlans: ['Room only', 'Breakfast included'],
  },
];

const travelEssentials = [
  {
    id: 'visa-egypt-priority',
    category: 'Visa',
    title: 'Egypt Priority Visa Assistance',
    provider: 'VANIR Travel Desk',
    price: '$79 / traveler',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/w8CpdbfU.jpg',
    summary: 'Fast document checklist, application review, and airport-entry readiness support for Egypt-bound travelers.',
    highlights: ['Checklist review', 'Priority document audit', 'Arrival support notes'],
  },
  {
    id: 'esim-global-10gb',
    category: 'eSIM',
    title: 'Global Travel eSIM 10GB',
    provider: 'Airalo Partner Lane',
    price: '$24',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/Uy3v8KBU.png',
    summary: 'Data-ready eSIM for Egypt and nearby destinations with instant QR activation after checkout.',
    highlights: ['Instant QR activation', '10GB data plan', 'Regional roaming ready'],
  },
  {
    id: 'esim-unlimited-premium',
    category: 'eSIM',
    title: 'Premium eSIM Unlimited Plus',
    provider: 'VANIR Connectivity Desk',
    price: '$52',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/75l8uHE8.png',
    summary: 'Unlimited data plan with priority network profile and concierge support for longer stays.',
    highlights: ['Unlimited data', 'Priority routing profile', '24/7 activation support'],
  },
  {
    id: 'insurance-premium-multi',
    category: 'Insurance',
    title: 'Premium Multi-Trip Insurance',
    provider: 'Allianz Travel Partner',
    price: '$118 / policy',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/w8CpdbfU.jpg',
    summary: 'Medical cover, baggage delay protection, and cancellation support for high-value itineraries.',
    highlights: ['Emergency medical cover', 'Trip cancellation', 'Baggage delay protection'],
  },
  {
    id: 'insurance-vip-complete',
    category: 'Insurance',
    title: 'VIP Complete Travel Protection',
    provider: 'VANIR Shield Partners',
    price: '$164 / policy',
    imageUrl: 'https://storage.googleapis.com/gen-lang-client-0364375301.firebasestorage.app/gallery/75l8uHE8.png',
    summary: 'Extended medical, missed-connection cover, and dedicated assistance hotlines in your destination.',
    highlights: ['Higher emergency limits', 'Missed connection cover', 'Priority claim support'],
  },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function confirmation(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function normalizeCategory(value) {
  return normalize(value);
}

function parseUploadedFilename(buffer) {
  const head = buffer.toString('utf8', 0, Math.min(buffer.length, 25000));
  const match = head.match(/filename="([^"]+)"/i);
  return match?.[1] || 'visa-document';
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(response, 200, { status: 'ok', port });
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 404, { error: 'Not found.' });
    return;
  }

  if (request.url === '/api/mobile/travel-essentials/visa/upload') {
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);
    if (!buffer.length) {
      sendJson(response, 400, { error: 'No file uploaded.' });
      return;
    }

    const fileName = parseUploadedFilename(buffer);
    sendJson(response, 200, {
      fileId: confirmation('DOC'),
      fileName,
      fileSize: buffer.length,
      status: 'uploaded',
    });
    return;
  }

  let rawBody = '';
  for await (const chunk of request) {
    rawBody += chunk;
  }

  let body = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    sendJson(response, 400, { error: 'Invalid JSON body.' });
    return;
  }

  if (request.url === '/api/mobile/flights/search') {
    const origin = normalize(body.origin);
    const destination = normalize(body.destination);
    const cabin = normalize(body.cabin);

    const offers = flightOffers.filter(offer => {
      const route = normalize(offer.route);
      return (!origin || route.includes(origin)) && (!destination || route.includes(destination)) && (!cabin || normalize(offer.cabin).includes(cabin));
    });

    sendJson(response, 200, { offers: offers.length ? offers : flightOffers });
    return;
  }

  if (request.url === '/api/mobile/hotels/search') {
    const city = normalize(body.city);
    const offers = hotelOffers.filter(offer => !city || normalize(offer.location).includes(city) || normalize(offer.name).includes(city));
    sendJson(response, 200, { offers: offers.length ? offers : hotelOffers });
    return;
  }

  if (request.url === '/api/mobile/travel-essentials/list') {
    const category = normalize(body.category);
    const items = travelEssentials.filter(item => !category || normalize(item.category) === category);
    sendJson(response, 200, { items: items.length ? items : travelEssentials });
    return;
  }

  if (request.url === '/api/mobile/travel-essentials/checkout') {
    const category = normalizeCategory(body.category);
    const confirmationCode = confirmation('ESS');

    if (category === 'visa') {
      sendJson(response, 200, {
        confirmationCode,
        status: 'submitted',
        visaCaseNumber: confirmation('VISA'),
      });
      return;
    }

    if (category === 'esim') {
      sendJson(response, 200, {
        confirmationCode,
        status: 'activated',
        activationCode: confirmation('ESIM'),
      });
      return;
    }

    if (category === 'insurance') {
      sendJson(response, 200, {
        confirmationCode,
        status: 'issued',
        policyNumber: confirmation('POL'),
      });
      return;
    }

    sendJson(response, 400, { error: 'Unsupported category.' });
    return;
  }

  if (request.url === '/api/mobile/flights/book') {
    sendJson(response, 200, { confirmationCode: confirmation('FLT'), status: 'confirmed', payload: body });
    return;
  }

  if (request.url === '/api/mobile/hotels/book') {
    sendJson(response, 200, { confirmationCode: confirmation('HTL'), status: 'confirmed', payload: body });
    return;
  }

  sendJson(response, 404, { error: 'Unknown route.' });
});

server.listen(port, () => {
  console.log(`Travel booking server listening on http://localhost:${port}`);
});