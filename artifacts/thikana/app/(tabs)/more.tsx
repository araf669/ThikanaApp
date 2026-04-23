import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, useNotifications } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

type Item = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  href?: any;
  onPress?: () => void;
  badge?: number;
  destructive?: boolean;
  accent?: string;
  initial?: string;
};

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { user, signOut } = useAuth();
  const { unread } = useNotifications();

  const account: Item[] = [
    { icon: "user", label: "Profile", href: "/profile", accent: colors.accentBlue },
    { icon: "bookmark", label: "Saved posts", href: "/saved", accent: colors.accentAmber },
    { icon: "list", label: "My listings", href: "/my-listings", accent: colors.accentViolet },
    { icon: "bell", label: "Notifications", href: "/notifications", badge: unread, accent: colors.accentRed },
  ];

  const actions: Item[] = [
    { icon: "plus-square", label: "Rent your house / flat", href: "/create-listing", accent: colors.accentTeal },
    { icon: "moon", label: "Host a short stay", href: { pathname: "/create-listing", params: { kind: "stay" } }, accent: colors.accentIndigo },
  ];

  const support: Item[] = [
    { icon: "settings", label: "App settings", href: "/settings", accent: colors.accentSlate },
    { icon: "help-circle", label: "Help & support", href: "/customer-service", accent: colors.accentTeal },
    { icon: "info", label: "About Thikana", href: "/about", accent: colors.accentSlate },
    { icon: "code", label: "Developer Info", href: "/developer-info", accent: colors.accentIndigo, initial: "A" },
  ];

  const auth: Item[] = user
    ? [{ icon: "log-out", label: "Logout", onPress: signOut, destructive: true, accent: colors.destructive }]
    : [{ icon: "phone", label: "Sign in with phone", href: "/auth/login", accent: colors.accentBlue }];

  const topPadding = (isWeb ? 67 : insets.top) + 6;
  const bottomPadding = (isWeb ? 84 + 24 : insets.bottom + 70) + 16;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding, paddingHorizontal: 16, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Branded header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 2 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: colors.foreground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 18,
              color: colors.background,
              letterSpacing: -0.5,
            }}
          >
            T
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 18,
              color: colors.foreground,
              letterSpacing: -0.3,
            }}
          >
            Thikana
          </Text>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 11,
              color: colors.mutedForeground,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            More
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push(user ? "/profile" : "/auth/login")}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: 14,
          backgroundColor: colors.card,
          borderRadius: colors.radius + 2,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        })}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Feather name="user" size={22} color={colors.foreground} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.foreground }}>
            {user ? (user.name ?? "Welcome back") : "You are browsing as guest"}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
            {user ? user.phone : "Sign in to post, save, and manage listings."}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      </Pressable>

      <Section title="Account" items={account} />
      <Section title="Post & host" items={actions} />
      <Section title="Support" items={support} />
      <Section title="" items={auth} />
      <Text
        style={{
          textAlign: "center",
          color: colors.mutedForeground,
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          marginTop: 8,
        }}
      >
        Thikana · v1.0 · Dhaka, Bangladesh
      </Text>
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: Item[] }) {
  const colors = useColors();
  return (
    <View style={{ gap: 8 }}>
      {title ? (
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 11,
            color: colors.mutedForeground,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginLeft: 4,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius + 2,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {items.map((it, idx) => {
          const tintColor = it.destructive ? colors.destructive : (it.accent ?? colors.foreground);
          return (
            <Pressable
              key={it.label}
              onPress={() => {
                if (it.onPress) it.onPress();
                else if (it.href) router.push(it.href);
              }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                gap: 12,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: colors.hairline,
                backgroundColor: pressed ? colors.muted : "transparent",
              })}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: tint(tintColor, 0.12),
                  borderWidth: 1,
                  borderColor: tint(tintColor, 0.22),
                }}
              >
                {it.initial ? (
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 14,
                      color: tintColor,
                      letterSpacing: -0.3,
                    }}
                  >
                    {it.initial}
                  </Text>
                ) : (
                  <Feather name={it.icon} size={16} color={tintColor} />
                )}
              </View>
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter_500Medium",
                  fontSize: 15,
                  color: it.destructive ? colors.destructive : colors.foreground,
                }}
              >
                {it.label}
              </Text>
              {it.badge && it.badge > 0 ? (
                <View
                  style={{
                    minWidth: 22,
                    height: 22,
                    paddingHorizontal: 6,
                    borderRadius: 11,
                    backgroundColor: colors.destructive,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" }}>{it.badge}</Text>
                </View>
              ) : null}
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Convert a hex color to rgba with given alpha for soft icon-tile fills.
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
