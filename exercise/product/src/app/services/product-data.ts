export interface Product {
  id: number;
  name: string;
  category: string;
  features: string[];
  price: string;
  imageFile?: string;
}

export const PRODUCTS: Product[] = [
   {
    id: 1,
    name: 'Apple Watch Series 10',
    category: 'Wearables',
    features: [
      'Blood glucose monitoring',
      'Mental health tracking',
      'Gesture control'
    ],
    price: '$499'
  },
  {
    id: 2,
    name: 'Samsung Galaxy Ring',
    category: 'Wearables',
    features: [
      'Sleep tracking',
      'Heart rate and fitness metrics',
      'Wireless charging'
    ],
    price: '$349'
  },
  {
    id: 3,
    name: 'Garmin Venu 3',
    category: 'Wearables',
    features: [
      'Advanced fitness analytics',
      'Built-in coaching',
      'AMOLED display'
    ],
    price: '$399'
  },

  {
    id: 4,
    name: 'Sony WH-1000XM6',
    category: 'Audio Tech',
    features: [
      'Enhanced noise cancellation',
      'Spatial audio',
      'AI-based sound optimization'
    ],
    price: '$429'
  },
  {
    id: 5,
    name: 'Apple AirPods Max 2',
    category: 'Audio Tech',
    features: [
      'Lossless audio support',
      'Adaptive transparency',
      'Improved comfort'
    ],
    price: '$599'
  },
  {
    id: 6,
    name: 'Bose Ultra Earbuds',
    category: 'Audio Tech',
    features: [
      'Personalized sound profiles',
      'Sweat resistance',
      'Multipoint Bluetooth'
    ],
    price: '$279'
  },

  {
    id: 7,
    name: 'Amazon Echo Hub',
    category: 'Smart Home',
    features: [
      'Central control for smart devices',
      'Matter-compatible',
      '8-inch touchscreen display'
    ],
    price: '$199'
  },
  {
    id: 8,
    name: 'Google Nest Thermostat Pro',
    category: 'Smart Home',
    features: [
      'AI-driven climate control',
      'Energy usage insights',
      'Wide compatibility'
    ],
    price: '$249'
  },
  {
    id: 9,
    name: 'Philips Hue Secure Cameras',
    category: 'Smart Home',
    features: [
      'Motion detection',
      'Encrypted cloud storage',
      'Lighting sync deterrence'
    ],
    price: '$299'
  },

  // 🧩 Accessories
  {
    id: 10,
    name: 'Anker GaNPrime Charger',
    category: 'Accessories',
    features: [
      '100W multi-port fast charging',
      'Compact design',
      'USB-C and USB-A compatibility'
    ],
    price: '$99'
  },
  {
    id: 11,
    name: 'Nomad Wireless Charging Pad Pro',
    category: 'Accessories',
    features: [
      '3-device charging',
      'MagSafe support',
      'Premium leather finish'
    ],
    price: '$149'
  },
  {
    id: 12,
    name: 'Peak Design Tech Pouch',
    category: 'Accessories',
    features: [
      'Organizes cables and chargers',
      'Weatherproof recycled nylon',
      'Compact travel design'
    ],
    price: '$79'
  }
];
