import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterSheet } from "@/components/FilterSheet";
import { Chip, IconButton, Input } from "@/components/UI";
import { PROPERTY_IMAGES, formatTaka } from "@/constants/data";
import { Filters, useListings, useSaved } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function StayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { stays, applyFilters } = useListings();
  const saved = useSaved();
  const [filters, setFilters] = useState<Filters>({ sort: "newest" });
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const visible = useMemo(() => {
    let res = applyFilters(stays, filters);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q),
      );
    }
    return res;
  }, [stays, filters, applyFilters, search]);

  const topPadding = (isWeb ? 67 : insets.top) + 6;
  const bottomPadding = (isWeb ? 84 + 24 : insets.bottom + 70) + 16;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={visible}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingHorizontal: 16,
          gap: 12,
        }}
        ListHeaderComponent={
          <View style={{ gap: 14, paddingBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>
                  Short stays
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>
                  Stay tonight, stay a week
                </Text>
              </View>
              <IconButton name="bell" onPress={() => router.push("/notifications")} />
            </View>
            <Input
              leftIcon="search"
              placeholder="Where to in Dhaka?"
              value={search}
              onChangeText={setSearch}
              rightIcon={search ? "x" : undefined}
              onRightIconPress={() => setSearch("")}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <Chip icon="sliders" label="Filters" onPress={() => setShowFilter(true)} />
              <Chip
                icon="users"
                label="1 guest"
                active={filters.guests === 1}
                onPress={() => setFilters({ ...filters, guests: filters.guests === 1 ? undefined : 1 })}
              />
              <Chip
                icon="users"
                label="2 guests"
                active={filters.guests === 2}
                onPress={() => setFilters({ ...filters, guests: filters.guests === 2 ? undefined : 2 })}
              />
              <Chip
                icon="users"
                label="4+ guests"
                active={filters.guests === 4}
                onPress={() => setFilters({ ...filters, guests: filters.guests === 4 ? undefined : 4 })}
              />
              <Chip
                label="WiFi"
                active={filters.amenities?.includes("WiFi")}
                onPress={() =>
                  setFilters({
                    ...filters,
                    amenities: filters.amenities?.includes("WiFi")
                      ? filters.amenities.filter((a) => a !== "WiFi")
                      : [...(filters.amenities ?? []), "WiFi"],
                  })
                }
              />
              <Chip
                label="AC"
                active={filters.amenities?.includes("AC")}
                onPress={() =>
                  setFilters({
                    ...filters,
                    amenities: filters.amenities?.includes("AC")
                      ? filters.amenities.filter((a) => a !== "AC")
                      : [...(filters.amenities ?? []), "AC"],
                  })
                }
              />
            </ScrollView>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
              {visible.length} stays available
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isS = saved.isSaved(item.id);
          return (
            <Pressable
              onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <View>
                <Image
                  source={PROPERTY_IMAGES[item.images[0] ?? 0]}
                  style={{ width: "100%", height: 150, backgroundColor: colors.muted }}
                  contentFit="cover"
                />
                <Pressable
                  onPress={() => saved.toggle(item.id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.95)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="heart" size={15} color={isS ? colors.destructive : "#0a0a0a"} />
                </Pressable>
              </View>
              <View style={{ padding: 10, gap: 4 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.foreground }}
                >
                  {item.title}
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground }}>
                  {item.area} · {item.guestCapacity} guests
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.foreground, marginTop: 2 }}>
                  {formatTaka(item.pricePerNight ?? 0)}{" "}
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground }}>
                    / night
                  </Text>
                </Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={{ paddingTop: 60, alignItems: "center" }}>
            <Feather name="moon" size={28} color={colors.mutedForeground} />
            <Text style={{ marginTop: 10, color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
              No stays match your search.
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          router.push({ pathname: "/create-listing", params: { kind: "stay" } });
        }}
        style={({ pressed }) => ({
          position: "absolute",
          right: 18,
          bottom: (isWeb ? 84 : insets.bottom + 70) + 16,
          height: 48,
          paddingHorizontal: 18,
          borderRadius: 24,
          backgroundColor: colors.foreground,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Feather name="plus" size={18} color={colors.background} />
        <Text style={{ color: colors.background, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
          Host a stay
        </Text>
      </Pressable>

      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        initial={filters}
        onApply={(f) => setFilters(f as any)}
        mode="stay"
      />
    </View>
  );
}
