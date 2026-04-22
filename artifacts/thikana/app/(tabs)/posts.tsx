import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterSheet } from "@/components/FilterSheet";
import { Chip, IconButton, Input, ListingCard } from "@/components/UI";
import { useListings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function PostsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { rentals, filters, setFilters, applyFilters } = useListings();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const visible = useMemo(() => {
    let res = applyFilters(rentals, filters);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    return res;
  }, [rentals, filters, applyFilters, search]);

  const topPadding = (isWeb ? 67 : insets.top) + 6;
  const bottomPadding = (isWeb ? 84 + 24 : insets.bottom + 70) + 16;

  const activeChips = [
    filters.area && { k: "area", l: filters.area, clear: () => setFilters({ ...filters, area: undefined }) },
    filters.type && { k: "type", l: filters.type, clear: () => setFilters({ ...filters, type: undefined }) },
    filters.suitability && {
      k: "s",
      l: filters.suitability,
      clear: () => setFilters({ ...filters, suitability: undefined }),
    },
    filters.rooms && { k: "r", l: `${filters.rooms}+ bed`, clear: () => setFilters({ ...filters, rooms: undefined }) },
    filters.furnished !== undefined && {
      k: "f",
      l: filters.furnished ? "Furnished" : "Unfurnished",
      clear: () => setFilters({ ...filters, furnished: undefined }),
    },
  ].filter(Boolean) as { k: string; l: string; clear: () => void }[];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={visible}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingHorizontal: 16,
          gap: 14,
        }}
        ListHeaderComponent={
          <View style={{ gap: 14, paddingBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>
                  Browse
                </Text>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>
                  Rental posts
                </Text>
              </View>
              <IconButton name="bell" onPress={() => router.push("/notifications")} />
            </View>
            <Input
              leftIcon="search"
              placeholder="Search title, area, keyword…"
              value={search}
              onChangeText={setSearch}
              rightIcon={search ? "x" : undefined}
              onRightIconPress={() => setSearch("")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <Chip icon="sliders" label="Filters" onPress={() => setShowFilter(true)} />
              <Chip
                icon="users"
                label="Bachelor"
                active={filters.suitability === "bachelor"}
                onPress={() =>
                  setFilters({
                    ...filters,
                    suitability: filters.suitability === "bachelor" ? undefined : "bachelor",
                  })
                }
              />
              <Chip
                icon="book"
                label="Student"
                active={filters.suitability === "student"}
                onPress={() =>
                  setFilters({
                    ...filters,
                    suitability: filters.suitability === "student" ? undefined : "student",
                  })
                }
              />
              <Chip
                icon="home"
                label="Family"
                active={filters.suitability === "family"}
                onPress={() =>
                  setFilters({
                    ...filters,
                    suitability: filters.suitability === "family" ? undefined : "family",
                  })
                }
              />
              <Chip
                label="Furnished"
                active={filters.furnished === true}
                onPress={() =>
                  setFilters({ ...filters, furnished: filters.furnished === true ? undefined : true })
                }
              />
            </ScrollView>
            {activeChips.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {activeChips.map((c) => (
                  <Pressable
                    key={c.k}
                    onPress={c.clear}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: colors.foreground,
                    }}
                  >
                    <Text style={{ color: colors.background, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                      {c.l}
                    </Text>
                    <Feather name="x" size={11} color={colors.background} />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
                {visible.length} results
              </Text>
              <Pressable
                onPress={() =>
                  setFilters({
                    ...filters,
                    sort:
                      filters.sort === "newest"
                        ? "lowest"
                        : filters.sort === "lowest"
                          ? "highest"
                          : "newest",
                  })
                }
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Feather name="bar-chart-2" size={13} color={colors.foreground} />
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground }}>
                  {filters.sort === "lowest"
                    ? "Lowest price"
                    : filters.sort === "highest"
                      ? "Highest price"
                      : "Newest"}
                </Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        ListEmptyComponent={
          <View style={{ paddingTop: 60, alignItems: "center" }}>
            <Feather name="inbox" size={28} color={colors.mutedForeground} />
            <Text style={{ marginTop: 10, color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
              No listings match your filters.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.foreground}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 600);
            }}
          />
        }
      />

      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          router.push("/create-listing");
        }}
        style={({ pressed }) => ({
          position: "absolute",
          right: 18,
          bottom: (isWeb ? 84 : insets.bottom + 70) + 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.foreground,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Feather name="plus" size={26} color={colors.background} />
      </Pressable>

      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        initial={filters}
        onApply={(f) => setFilters(f)}
        mode="rent"
      />
    </View>
  );
}
