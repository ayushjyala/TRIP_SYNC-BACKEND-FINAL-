'use strict';

/**
 * seed.js — Populates MongoDB with Trip Sync destination data.
 * Run: npm run seed
 * Or:  MONGODB_URI="..." node seed.js
 */

require('dotenv').config();
const mongoose    = require('mongoose');
const Destination = require('./models/Destination');

const destinations = [
  {
    name: 'Goa',
    tagline: 'Sun, sand, and soul on India\'s golden coast',
    tag: '🏖 Beach Paradise',
    category: 'Beach',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    description: 'Goa is India\'s smallest state but its biggest party — a sun-kissed stretch of coastline where Portuguese colonial charm meets laid-back beach culture. Explore spice plantations, baroque churches, night markets, and some of Asia\'s finest sunsets.',
    bestTimeToVisit: 'November to February is ideal — dry skies, cool breezes, and the famous Goa Carnival in February. Avoid June–September monsoon unless you love dramatic rain and empty beaches at lower prices.',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    attractions: [
      { name: 'Baga Beach',      lat: 15.5553, lng: 73.7517 },
      { name: 'Basilica of Bom Jesus', lat: 15.5009, lng: 73.9116 },
      { name: 'Anjuna Flea Market',    lat: 15.5738, lng: 73.7403 },
    ],
    nearbyRestaurants: ['Britto\'s Beach Bar', 'Fisherman\'s Wharf', 'Gunpowder', 'Thalassa Greek Restaurant'],
    nearbyHotels:      ['Taj Fort Aguada Resort', 'W Goa', 'Alila Diwa Goa'],
    nearbyHostels:     ['Zostel Goa', 'Jungle Hostel Arambol'],
    funActivities:     ['Scuba Diving', 'Paragliding', 'Spice Plantation Tour', 'Sunset Cruise', 'Casino Night', 'Kayaking', 'Night Market Shopping'],
  },
  {
    name: 'Jaisalmer',
    tagline: 'The Golden City rising from Thar\'s endless sands',
    tag: '🏜 Desert Fortress',
    category: 'Desert',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    description: 'Jaisalmer is a living fairy tale carved from golden sandstone in the heart of the Thar Desert. Its 12th-century fort — one of the world\'s few inhabited forts — rises like a mirage above the dunes. Camel safaris, havelis, and a sky blazing with stars await.',
    bestTimeToVisit: 'October to March. The Desert Festival in February is unmissable — folk music, camel races, and turban-tying competitions. Summers exceed 45°C; avoid unless you must.',
    coordinates: { lat: 26.9157, lng: 70.9083 },
    attractions: [
      { name: 'Jaisalmer Fort',   lat: 26.9124, lng: 70.9089 },
      { name: 'Sam Sand Dunes',   lat: 26.8765, lng: 70.5627 },
      { name: 'Patwon Ki Haveli', lat: 26.9144, lng: 70.9124 },
    ],
    nearbyRestaurants: ['Trio Restaurant', 'The Lal Garh', 'Kuku Da Dhaba'],
    nearbyHotels:      ['Suryagarh Palace', 'The Serai', 'Hotel Nachana Haveli'],
    nearbyHostels:     ['Zostel Jaisalmer', 'Moustache Jaisalmer'],
    funActivities:     ['Camel Safari', 'Camp Under the Stars', 'Jeep Safari', 'Desert Festival', 'Haveli Walk', 'Sunset at Sam Dunes', 'Folk Music Evening'],
  },
  {
    name: 'Varanasi',
    tagline: 'The eternal city where life, death, and the Ganges meet',
    tag: '🕌 Spiritual Capital',
    category: 'Spiritual',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80',
    description: 'Varanasi is among the oldest continuously inhabited cities on Earth and Hinduism\'s holiest pilgrimage site. Witness the hypnotic Ganga Aarti at Dashashwamedh Ghat, take a dawn boat ride past 88 ghats, and get lost in labyrinthine alleyways fragrant with marigolds and incense.',
    bestTimeToVisit: 'October to March. Dev Deepawali (November) is extraordinary — 1 million diyas illuminate every ghat. Summer is brutal; monsoon floods the lower ghats.',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    attractions: [
      { name: 'Dashashwamedh Ghat', lat: 25.3063, lng: 83.0093 },
      { name: 'Kashi Vishwanath Temple', lat: 25.3109, lng: 83.0107 },
      { name: 'Sarnath',           lat: 25.3714, lng: 83.0244 },
    ],
    nearbyRestaurants: ['Pizzeria Vaatika Café', 'Banaras Tea House', 'Keshari Restaurant'],
    nearbyHotels:      ['BrijRama Palace', 'Taj Nadesar Palace', 'Hotel Ganges View'],
    nearbyHostels:     ['Stops Hostel Varanasi', 'Moustache Varanasi'],
    funActivities:     ['Ganga Aarti Ceremony', 'Sunrise Boat Ride', 'Silk Weaving Workshop', 'Yoga Retreat', 'Sarnath Day Trip', 'Lassi at Blue Lassi', 'Cooking Class'],
  },
  {
    name: 'Leh-Ladakh',
    tagline: 'Roof of the world — monasteries above the clouds',
    tag: '⛰ High Altitude Adventure',
    category: 'Adventure',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    description: 'Ladakh is India\'s last frontier — a high-altitude cold desert at 3,500m+ where turquoise lakes mirror snow-capped peaks, ancient Buddhist monasteries perch on cliffs, and roads snake through the world\'s most dramatic landscapes. Not for the faint-hearted; utterly unforgettable.',
    bestTimeToVisit: 'June to September. The road from Manali opens in May; from Srinagar, April. Winter (Nov–Mar) is for the Chadar Trek on the frozen Zanskar River — for the bold only.',
    coordinates: { lat: 34.1526, lng: 77.5771 },
    attractions: [
      { name: 'Pangong Tso Lake', lat: 33.7642, lng: 78.6642 },
      { name: 'Thiksey Monastery', lat: 33.9765, lng: 77.6663 },
      { name: 'Nubra Valley',      lat: 34.6831, lng: 77.5562 },
    ],
    nearbyRestaurants: ['Tibetan Kitchen', 'The Lamayuru Restaurant', 'Penguin Garden Cafe'],
    nearbyHotels:      ['The Grand Dragon Ladakh', 'Chamba Camp Thiksey', 'Nimmu House'],
    nearbyHostels:     ['Zostel Leh', 'Stok Palace Heritage Hotel Dorm'],
    funActivities:     ['Chadar Trek', 'River Rafting on Zanskar', 'Bike Trip Manali–Leh', 'Monastery Hopping', 'Stargazing at Pangong', 'Double Hump Camel Ride', 'Hot Air Balloon'],
  },
  {
    name: 'Kerala Backwaters',
    tagline: 'Float through emerald lagoons on a wooden kettuvallam',
    tag: '🌿 Serene Waterways',
    category: 'Beach',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    description: 'Kerala\'s 900km network of interconnected canals, rivers, and lakes is best experienced from a houseboat drifting past paddy fields, toddy-tappers, and egrets. Alleppey (Alappuzha) is the epicentre — rent a kettuvallam for a night and wake up to birdsong and fishermen casting nets.',
    bestTimeToVisit: 'September to March. The Nehru Trophy Boat Race (August) is spectacular if you can handle the monsoon. October–February is peak season with dry, pleasant weather.',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    attractions: [
      { name: 'Vembanad Lake',     lat: 9.5800, lng: 76.3900 },
      { name: 'Alleppey Beach',    lat: 9.4939, lng: 76.3270 },
      { name: 'Kumarakom Bird Sanctuary', lat: 9.6140, lng: 76.4326 },
    ],
    nearbyRestaurants: ['Thaff Restaurant', 'Chakara Restaurant', 'Dreamers Restaurant'],
    nearbyHotels:      ['Kumarakom Lake Resort', 'Marari Beach Resort', 'CGH Earth Coconut Lagoon'],
    nearbyHostels:     ['Zostel Alleppey', 'Deshadan Island Resort'],
    funActivities:     ['Houseboat Overnight Stay', 'Canoe Tour', 'Village Walk', 'Cooking Class (Kerala Sadya)', 'Ayurvedic Massage', 'Bird Watching', 'Kayaking'],
  },
  {
    name: 'Hampi',
    tagline: 'Lost empire of the Vijayanagara kings among giant boulders',
    tag: '🏛 UNESCO Heritage',
    category: 'Heritage',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80',
    description: 'Hampi is a UNESCO World Heritage Site and one of Asia\'s greatest ruins — a surreal landscape of 1,600 granite temples, royal enclosures, and elephant stables scattered across a boulder-strewn moonscape in Karnataka. Rent a bicycle and lose yourself for days.',
    bestTimeToVisit: 'October to February. Winters are warm and dry, perfect for cycling between ruins. Summer (Mar–May) is scorching; July–September monsoon is beautiful but some sites get muddy.',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    attractions: [
      { name: 'Virupaksha Temple', lat: 15.3360, lng: 76.4598 },
      { name: 'Vittala Temple',    lat: 15.3383, lng: 76.4760 },
      { name: 'Lotus Mahal',       lat: 15.3207, lng: 76.4637 },
    ],
    nearbyRestaurants: ['Mango Tree Restaurant', 'Ravi\'s Rose Restaurant', 'The Goan Corner'],
    nearbyHotels:      ['Clarks Inn Hampi', 'Evolve Back Kamalapura Palace', 'Hotel Mayura Bhuvaneshwari'],
    nearbyHostels:     ['Goan Corner Hostel', 'Hampi\'s Boulders'],
    funActivities:     ['Bicycle Tour of Ruins', 'Coracle Boat Ride', 'Sunrise at Matanga Hill', 'Climbing Boulders', 'Tungabhadra Sunset', 'Rock Carvings Walk', 'Hippie Island Chill'],
  },
  {
    name: 'Darjeeling',
    tagline: 'Tea gardens and Himalayan panoramas at dawn',
    tag: '⛰ Hill Station',
    category: 'Hill Station',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    description: 'Perched at 2,050m in the foothills of the Himalayas, Darjeeling is famous for its muscatel tea, the UNESCO-listed toy train, and the jaw-dropping view of Kanchenjunga — the world\'s third-highest peak — at sunrise from Tiger Hill.',
    bestTimeToVisit: 'March to May for blooming rhododendrons and clear Himalayan views. October to December post-monsoon is also superb. June–September monsoon brings mist, leeches, and closed roads.',
    coordinates: { lat: 27.0360, lng: 88.2627 },
    attractions: [
      { name: 'Tiger Hill',        lat: 26.9928, lng: 88.2847 },
      { name: 'Darjeeling Tea Estate', lat: 27.0515, lng: 88.2786 },
      { name: 'Batasia Loop',      lat: 27.0151, lng: 88.2596 },
    ],
    nearbyRestaurants: ['Glenary\'s Bakery & Restaurant', 'The Park Restaurant', 'Kunga Restaurant'],
    nearbyHotels:      ['Elgin Darjeeling', 'Mayfair Darjeeling', 'Glenburn Tea Estate'],
    nearbyHostels:     ['Zostel Darjeeling', 'Road Runner Hostel'],
    funActivities:     ['Sunrise at Tiger Hill', 'Toy Train Ride', 'Tea Estate Tour & Tasting', 'Trekking to Sandakphu', 'Tibetan Monastery Visit', 'Shopping at Chowrasta', 'Himalayan Mountaineering Institute'],
  },
  {
    name: 'Andaman Islands',
    tagline: 'Crystal waters and coral reefs at the edge of the Bay of Bengal',
    tag: '🐠 Tropical Escape',
    category: 'Beach',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80',
    description: 'The Andaman Islands are India\'s best-kept secret — 572 islands of which only 37 are inhabited, offering powder-white beaches, bioluminescent plankton nights, scuba diving on untouched reefs, and the historic Cellular Jail at Port Blair. Radhanagar Beach is consistently ranked Asia\'s best.',
    bestTimeToVisit: 'October to May. December–January is peak season. June–September monsoon makes the sea rough and ferry services irregular. Dive visibility is best January–April.',
    coordinates: { lat: 11.7401, lng: 92.6586 },
    attractions: [
      { name: 'Radhanagar Beach',  lat: 11.9879, lng: 92.8854 },
      { name: 'Cellular Jail',     lat: 11.6726, lng: 92.7463 },
      { name: 'Elephant Beach',    lat: 12.0185, lng: 92.9133 },
    ],
    nearbyRestaurants: ['Annapurna Restaurant', 'Full Moon Café', 'New Lighthouse Restaurant'],
    nearbyHotels:      ['Taj Exotica Resort & Spa', 'Havelock Island Beach Resort', 'Barefoot at Havelock'],
    nearbyHostels:     ['Zostel Havelock', 'Govind Nagar Beach Resort Budget Rooms'],
    funActivities:     ['Scuba Diving', 'Snorkelling', 'Sea Walking', 'Kayaking through Mangroves', 'Night Bioluminescence Tour', 'Glass-bottom Boat Ride', 'Light & Sound Show at Cellular Jail'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    await Destination.deleteMany({});
    console.log('🗑   Cleared existing destinations');

    const inserted = await Destination.insertMany(destinations);
    console.log(`✅  Seeded ${inserted.length} destinations`);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB');
  }
}

seed();
