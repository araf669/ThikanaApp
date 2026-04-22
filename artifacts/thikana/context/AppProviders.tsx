import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Listing, SEED_LISTINGS, timeAgo } from "@/constants/data";

// ----------------------- Auth -----------------------

export type UserProfile = {
  id: string;
  phone: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isReady: boolean;
  requestOtp: (phone: string) => Promise<string>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const USER_KEY = "thikana:user";
const PENDING_OTP_KEY = "thikana:pendingOtp";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const persist = useCallback(async (u: UserProfile | null) => {
    setUser(u);
    if (u) await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    else await AsyncStorage.removeItem(USER_KEY);
  }, []);

  const requestOtp = useCallback(async (phone: string) => {
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    await AsyncStorage.setItem(
      PENDING_OTP_KEY,
      JSON.stringify({ phone, otp, ts: Date.now() }),
    );
    return otp;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string) => {
      const raw = await AsyncStorage.getItem(PENDING_OTP_KEY);
      if (!raw) return false;
      const pending = JSON.parse(raw) as { phone: string; otp: string };
      if (pending.phone !== phone || pending.otp !== otp) return false;
      await AsyncStorage.removeItem(PENDING_OTP_KEY);
      await persist({ id: "u_" + phone.replace(/[^0-9]/g, ""), phone });
      return true;
    },
    [persist],
  );

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!user) return;
      await persist({ ...user, ...patch });
    },
    [user, persist],
  );

  const signOut = useCallback(async () => {
    await persist(null);
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{ user, isReady, requestOtp, verifyOtp, updateProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

// ----------------------- Listings -----------------------

const USER_LISTINGS_KEY = "thikana:userListings";

export type Filters = {
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  bathrooms?: number;
  type?: Listing["type"];
  furnished?: boolean;
  suitability?: Listing["suitability"][number];
  amenities?: string[];
  guests?: number;
  sort?: "newest" | "lowest" | "highest" | "nearest";
};

type ListingsContextType = {
  all: Listing[];
  rentals: Listing[];
  stays: Listing[];
  myListings: Listing[];
  addListing: (
    l: Omit<Listing, "id" | "postedAt" | "verified" | "ownerId">,
  ) => Promise<Listing>;
  removeListing: (id: string) => Promise<void>;
  filters: Filters;
  setFilters: (f: Filters) => void;
  applyFilters: (list: Listing[], f: Filters) => Listing[];
  getById: (id: string) => Listing | undefined;
};

const ListingsContext = createContext<ListingsContextType | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<Filters>({ sort: "newest" });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(USER_LISTINGS_KEY);
      if (raw) setUserListings(JSON.parse(raw));
    })();
  }, []);

  const persist = useCallback(async (list: Listing[]) => {
    setUserListings(list);
    await AsyncStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(list));
  }, []);

  const addListing: ListingsContextType["addListing"] = useCallback(
    async (l) => {
      const item: Listing = {
        ...l,
        id: "u" + Date.now().toString(36),
        postedAt: Date.now(),
        verified: false,
        ownerId: user?.id,
      };
      await persist([item, ...userListings]);
      return item;
    },
    [userListings, persist, user],
  );

  const removeListing = useCallback(
    async (id: string) => {
      await persist(userListings.filter((l) => l.id !== id));
    },
    [userListings, persist],
  );

  const all = useMemo(() => [...userListings, ...SEED_LISTINGS], [userListings]);
  const rentals = useMemo(() => all.filter((l) => l.kind === "rent"), [all]);
  const stays = useMemo(() => all.filter((l) => l.kind === "stay"), [all]);
  const myListings = useMemo(
    () => (user ? all.filter((l) => l.ownerId === user.id) : []),
    [all, user],
  );

  const applyFilters = useCallback((list: Listing[], f: Filters) => {
    let res = list.slice();
    if (f.area) res = res.filter((l) => l.area === f.area);
    if (f.type) res = res.filter((l) => l.type === f.type);
    if (f.furnished !== undefined)
      res = res.filter((l) => l.furnished === f.furnished);
    if (f.rooms) res = res.filter((l) => l.bedrooms >= f.rooms!);
    if (f.bathrooms) res = res.filter((l) => l.bathrooms >= f.bathrooms!);
    if (f.suitability)
      res = res.filter((l) => l.suitability.includes(f.suitability!));
    if (f.amenities && f.amenities.length)
      res = res.filter((l) =>
        f.amenities!.every((a) => l.amenities.includes(a)),
      );
    if (f.guests)
      res = res.filter((l) => (l.guestCapacity ?? 0) >= f.guests!);
    if (f.minPrice !== undefined)
      res = res.filter((l) => priceOf(l) >= f.minPrice!);
    if (f.maxPrice !== undefined)
      res = res.filter((l) => priceOf(l) <= f.maxPrice!);
    if (f.sort === "lowest") res.sort((a, b) => priceOf(a) - priceOf(b));
    else if (f.sort === "highest") res.sort((a, b) => priceOf(b) - priceOf(a));
    else res.sort((a, b) => b.postedAt - a.postedAt);
    return res;
  }, []);

  const getById = useCallback(
    (id: string) => all.find((l) => l.id === id),
    [all],
  );

  return (
    <ListingsContext.Provider
      value={{
        all,
        rentals,
        stays,
        myListings,
        addListing,
        removeListing,
        filters,
        setFilters,
        applyFilters,
        getById,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

function priceOf(l: Listing) {
  return l.kind === "stay" ? (l.pricePerNight ?? 0) : l.rent;
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return ctx;
}

// ----------------------- Saved -----------------------

const SAVED_KEY = "thikana:saved";

type SavedContextType = {
  ids: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
};

const SavedContext = createContext<SavedContextType | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      if (raw) setIds(JSON.parse(raw));
    })();
  }, []);

  const persist = useCallback(async (next: string[]) => {
    setIds(next);
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
      await persist(next);
    },
    [ids, persist],
  );

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <SavedContext.Provider value={{ ids, isSaved, toggle }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}

// ----------------------- Notifications -----------------------

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  ts: number;
  read: boolean;
  icon: string;
  time: string;
};

type NotificationsContextType = {
  items: NotificationItem[];
  unread: number;
  markAllRead: () => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(
  null,
);

const SEED_NOTIFICATIONS: Omit<NotificationItem, "time">[] = [
  {
    id: "n1",
    title: "New rental in Dhanmondi",
    body: "A 3-bed family flat just listed near Road 7.",
    ts: Date.now() - 1000 * 60 * 30,
    read: false,
    icon: "home",
  },
  {
    id: "n2",
    title: "Saved search update",
    body: "2 new bachelor-friendly rooms in Mirpur.",
    ts: Date.now() - 1000 * 60 * 60 * 4,
    read: false,
    icon: "search",
  },
  {
    id: "n3",
    title: "Welcome to Thikana",
    body: "Discover rentals near you on the map. Tap a pin to preview.",
    ts: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    icon: "info",
  },
];

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<NotificationItem[]>(
    SEED_NOTIFICATIONS.map((n) => ({ ...n, time: timeAgo(n.ts) })),
  );

  const markAllRead = useCallback(() => {
    setItems((cur) => cur.map((i) => ({ ...i, read: true })));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const unread = items.filter((i) => !i.read).length;

  return (
    <NotificationsContext.Provider value={{ items, unread, markAllRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error("useNotifications must be inside NotificationsProvider");
  return ctx;
}

// ----------------------- Settings -----------------------

const SETTINGS_KEY = "thikana:settings";

export type AppSettings = {
  theme: "system" | "light" | "dark";
  pushEnabled: boolean;
  emailEnabled: boolean;
  alertNewListings: boolean;
  defaultSort: "newest" | "lowest" | "highest";
  distanceUnit: "km" | "mi";
  locationEnabled: boolean;
};

type SettingsContextType = {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => Promise<void>;
};

const defaultSettings: AppSettings = {
  theme: "system",
  pushEnabled: true,
  emailEnabled: false,
  alertNewListings: true,
  defaultSort: "newest",
  distanceUnit: "km",
  locationEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    })();
  }, []);

  const update = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    },
    [settings],
  );

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}
