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
};

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { user, signOut } = useAuth();
  const { unread } = useNotifications();

  const account: Item[] = [
    { icon: "user", label: "Profile", href: "/profile" },
    { icon: "bookmark", label: "Saved posts", href: "/saved" },
    { icon: "list", label: "My listings", href: "/my-listings" },
    { icon: "bell", label: "Notifications", href: "/notifications", badge: unread },
  ];

  const actions: Item[] = [
    { icon: "plus-square", label: "Rent your house / flat", href: "/create-listing" },
    { icon: "moon", label: "Host a short stay", href: { pathname: "/create-listing", params: { kind: "stay" } } },
  ];

  const support: Item[] = [
    { icon: "headphones", label: "Customer service", href: "/customer-service" },
    { icon: "settings", label: "App settings", href: "/settings" },
    { icon: "help-circle", label: "Help & support", href: "/customer-service" },
    { icon: "info", label: "About Thikana", href: "/about" },
  ];

  const auth: Item[] = user
    ? [{ icon: "log-out", label: "Logout", onPress: signOut, destructive: true }]
    : [{ icon: "phone", label: "Sign in with phone", href: "/auth/login" }];

  const topPadding = (isWeb ? 67 : insets.top) + 6;
  const bottomPadding = (isWeb ? 84 + 24 : insets.bottom + 70) + 16;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding, paddingHorizontal: 16, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>
          Thikana
        </Text>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>More</Text>
      </View>

      <Pressable
        onPress={() => router.push(user ? "/profile" : "/auth/login")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: 14,
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
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
            fontSize: 13,
            color: colors.mutedForeground,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {items.map((it, idx) => (
          <Pressable
            key={it.label}
            onPress={() => {
              if (it.onPress) it.onPress();
              else if (it.href) router.push(it.href);
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              padding: 14,
              gap: 14,
              borderTopWidth: idx === 0 ? 0 : 1,
              borderTopColor: colors.border,
              backgroundColor: pressed ? colors.muted : "transparent",
            })}
          >
            <Feather
              name={it.icon}
              size={18}
              color={it.destructive ? colors.destructive : colors.foreground}
            />
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
        ))}
      </View>
    </View>
  );
}
