export type PropertyType = "flat" | "room" | "sublet" | "house" | "studio";
export type Suitability = "family" | "bachelor" | "student" | "couple";

export type Listing = {
  id: string;
  title: string;
  type: PropertyType;
  area: string;
  address: string;
  rent: number;
  advance?: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  drawing: boolean;
  dining: boolean;
  furnished: boolean;
  suitability: Suitability[];
  availableFrom: string;
  description: string;
  amenities: string[];
  images: number[];
  contactNumber: string;
  whatsapp?: string;
  lat: number;
  lng: number;
  verified: boolean;
  postedAt: number;
  kind: "rent" | "stay";
  pricePerNight?: number;
  guestCapacity?: number;
  minStay?: number;
  ownerName: string;
  ownerId?: string;
};

export const PROPERTY_IMAGES = [
  require("../assets/images/property1.png"),
  require("../assets/images/property2.png"),
  require("../assets/images/property3.png"),
  require("../assets/images/property4.png"),
  require("../assets/images/property5.png"),
];

export const DHAKA_AREAS = [
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Mirpur",
  "Mohammadpur",
  "Uttara",
  "Bashundhara",
  "Old Dhaka",
  "Tejgaon",
  "Motijheel",
];

export const AMENITIES_LONG = [
  "Lift",
  "Generator",
  "Parking",
  "Security",
  "Gas",
  "Wifi-ready",
  "Rooftop",
];

export const AMENITIES_STAY = [
  "WiFi",
  "AC",
  "Kitchen",
  "Attached bath",
  "TV",
  "Washer",
  "Workspace",
];

const BASE_LAT = 23.8103;
const BASE_LNG = 90.4125;

function jitter(seed: number, range = 0.05): number {
  const x = Math.sin(seed) * 10000;
  return (x - Math.floor(x) - 0.5) * range * 2;
}

export const SEED_LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Spacious 3-bed family flat near Dhanmondi 27",
    type: "flat",
    area: "Dhanmondi",
    address: "House 14, Road 7, Dhanmondi",
    rent: 42000,
    advance: 84000,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    drawing: true,
    dining: true,
    furnished: false,
    suitability: ["family"],
    availableFrom: "2026-05-01",
    description:
      "South-facing 1450 sqft flat in a quiet residential building. Excellent ventilation, two balconies, and dedicated parking.",
    amenities: ["Lift", "Generator", "Parking", "Security", "Gas"],
    images: [0, 3, 1],
    contactNumber: "+8801711000001",
    whatsapp: "+8801711000001",
    lat: BASE_LAT + jitter(1),
    lng: BASE_LNG + jitter(2),
    verified: true,
    postedAt: Date.now() - 1000 * 60 * 60 * 6,
    kind: "rent",
    ownerName: "Rahim Uddin",
  },
  {
    id: "l2",
    title: "Bachelor friendly single room in Mirpur 10",
    type: "room",
    area: "Mirpur",
    address: "Block C, Mirpur 10",
    rent: 8500,
    advance: 8500,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 0,
    drawing: false,
    dining: false,
    furnished: true,
    suitability: ["bachelor", "student"],
    availableFrom: "2026-05-10",
    description:
      "Furnished single room with attached bath. Walking distance from Mirpur 10 metro and shopping.",
    amenities: ["Generator", "Security", "Gas"],
    images: [1, 0],
    contactNumber: "+8801711000002",
    lat: BASE_LAT + jitter(3),
    lng: BASE_LNG + jitter(4),
    verified: false,
    postedAt: Date.now() - 1000 * 60 * 60 * 24,
    kind: "rent",
    ownerName: "Shamim Hasan",
  },
  {
    id: "l3",
    title: "Modern 2-bed sublet in Banani 11",
    type: "sublet",
    area: "Banani",
    address: "Road 11, Banani",
    rent: 35000,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    drawing: true,
    dining: true,
    furnished: true,
    suitability: ["family", "couple"],
    availableFrom: "2026-04-25",
    description:
      "Fully furnished modern sublet in a serviced building. Includes utilities and weekly cleaning.",
    amenities: ["Lift", "Generator", "Parking", "Security", "Wifi-ready"],
    images: [3, 0, 4],
    contactNumber: "+8801711000003",
    whatsapp: "+8801711000003",
    lat: BASE_LAT + jitter(5),
    lng: BASE_LNG + jitter(6),
    verified: true,
    postedAt: Date.now() - 1000 * 60 * 60 * 12,
    kind: "rent",
    ownerName: "Nadia Karim",
  },
  {
    id: "l4",
    title: "Student-friendly shared flat in Mohammadpur",
    type: "flat",
    area: "Mohammadpur",
    address: "Tajmahal Road, Mohammadpur",
    rent: 6000,
    bedrooms: 4,
    bathrooms: 2,
    balconies: 1,
    drawing: true,
    dining: false,
    furnished: false,
    suitability: ["student", "bachelor"],
    availableFrom: "2026-05-15",
    description:
      "Single seat available in a 4-bed student flat. Calm, study-friendly environment with reliable WiFi.",
    amenities: ["Generator", "Gas", "Wifi-ready"],
    images: [1],
    contactNumber: "+8801711000004",
    lat: BASE_LAT + jitter(7),
    lng: BASE_LNG + jitter(8),
    verified: false,
    postedAt: Date.now() - 1000 * 60 * 60 * 48,
    kind: "rent",
    ownerName: "Tareq Aziz",
  },
  {
    id: "l5",
    title: "Premium 4-bed duplex in Gulshan 2",
    type: "house",
    area: "Gulshan",
    address: "Avenue 6, Gulshan 2",
    rent: 120000,
    advance: 360000,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    drawing: true,
    dining: true,
    furnished: false,
    suitability: ["family"],
    availableFrom: "2026-06-01",
    description:
      "2800 sqft duplex with private rooftop. Premium finishes, gated community, and 24/7 security.",
    amenities: ["Lift", "Generator", "Parking", "Security", "Gas", "Rooftop"],
    images: [2, 3, 0],
    contactNumber: "+8801711000005",
    whatsapp: "+8801711000005",
    lat: BASE_LAT + jitter(9),
    lng: BASE_LNG + jitter(10),
    verified: true,
    postedAt: Date.now() - 1000 * 60 * 60 * 3,
    kind: "rent",
    ownerName: "Aminul Haque",
  },
  {
    id: "l6",
    title: "Cozy 1-bed flat in Bashundhara R/A",
    type: "flat",
    area: "Bashundhara",
    address: "Block J, Bashundhara R/A",
    rent: 18000,
    advance: 36000,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    drawing: false,
    dining: true,
    furnished: false,
    suitability: ["couple", "bachelor"],
    availableFrom: "2026-05-05",
    description:
      "Quiet 700 sqft flat in a new building. Perfect for a working couple or single professional.",
    amenities: ["Lift", "Generator", "Parking", "Gas"],
    images: [1, 3],
    contactNumber: "+8801711000006",
    lat: BASE_LAT + jitter(11),
    lng: BASE_LNG + jitter(12),
    verified: false,
    postedAt: Date.now() - 1000 * 60 * 60 * 30,
    kind: "rent",
    ownerName: "Rumana Akter",
  },

  // Short-stay listings
  {
    id: "s1",
    title: "Designer studio in Gulshan — short stay",
    type: "studio",
    area: "Gulshan",
    address: "Road 41, Gulshan 2",
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    drawing: false,
    dining: true,
    furnished: true,
    suitability: ["couple"],
    availableFrom: "2026-04-22",
    description:
      "A bright designer studio for short stays. Walk to embassies, restaurants, and Gulshan Lake. Self check-in.",
    amenities: ["WiFi", "AC", "Kitchen", "Attached bath", "Workspace", "TV"],
    images: [4, 0, 1],
    contactNumber: "+8801711000010",
    whatsapp: "+8801711000010",
    lat: BASE_LAT + jitter(13),
    lng: BASE_LNG + jitter(14),
    verified: true,
    postedAt: Date.now() - 1000 * 60 * 60 * 4,
    kind: "stay",
    pricePerNight: 4500,
    guestCapacity: 2,
    minStay: 1,
    ownerName: "Tania Hossain",
  },
  {
    id: "s2",
    title: "Furnished 2-bed in Banani — perfect for travel",
    type: "flat",
    area: "Banani",
    address: "Road 12, Banani",
    rent: 0,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    drawing: true,
    dining: true,
    furnished: true,
    suitability: ["family", "couple"],
    availableFrom: "2026-04-23",
    description:
      "Spacious 2-bed apartment ideal for short business trips and family visits. Daily housekeeping available on request.",
    amenities: ["WiFi", "AC", "Kitchen", "Attached bath", "Washer", "TV"],
    images: [0, 3, 4],
    contactNumber: "+8801711000011",
    whatsapp: "+8801711000011",
    lat: BASE_LAT + jitter(15),
    lng: BASE_LNG + jitter(16),
    verified: true,
    postedAt: Date.now() - 1000 * 60 * 60 * 18,
    kind: "stay",
    pricePerNight: 7800,
    guestCapacity: 4,
    minStay: 2,
    ownerName: "Imran Chowdhury",
  },
  {
    id: "s3",
    title: "Quiet single room in Uttara Sector 7",
    type: "room",
    area: "Uttara",
    address: "Sector 7, Uttara",
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 0,
    drawing: false,
    dining: false,
    furnished: true,
    suitability: ["bachelor"],
    availableFrom: "2026-04-22",
    description:
      "Compact private room near Uttara metro. Great for short interview or exam stays.",
    amenities: ["WiFi", "AC", "Attached bath"],
    images: [1],
    contactNumber: "+8801711000012",
    lat: BASE_LAT + jitter(17),
    lng: BASE_LNG + jitter(18),
    verified: false,
    postedAt: Date.now() - 1000 * 60 * 60 * 9,
    kind: "stay",
    pricePerNight: 2200,
    guestCapacity: 1,
    minStay: 1,
    ownerName: "Mehedi Khan",
  },
];

export function formatTaka(n: number): string {
  return "৳ " + n.toLocaleString("en-IN");
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}
