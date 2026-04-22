import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterSheet } from "@/components/FilterSheet";
import { MapView } from "@/components/MapView";
import { Button, Chip, IconButton, Input } from "@/components/UI";
import { DHAKA_AREAS, PROPERTY_IMAGES, formatTaka } from "@/constants/data";
import { useListings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function MapsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { rentals, filters, setFilters, applyFilters } = useListings();

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const localFilters = useMemo(
    () => ({
      ...filters,
      area: filters.area,
    }),
    [filters],
  );

  const visible = useMemo(() => {
    let res = applyFilters(rentals, localFilters);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q),
      );
    }
    return res;
  }, [rentals, localFilters, applyFilters, search]);

  const selected = visible.find((l) => l.id === selectedId) ?? visible[0];

  const topPadding = (isWeb ? 67 : insets.top) + 6;
  const bottomPadding = (isWeb ? 84 + 24 : insets.bottom + 70) + 16;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
          paddingHorizontal: 16,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.mutedForeground,
              }}
            >
              Discover
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 22,
                color: colors.foreground,
              }}
            >
              Rentals near you
            </Text>
          </View>
          <IconButton
            name="bell"
            onPress={() => router.push("/notifications")}
          />
        </View>

        <Input
          leftIcon="search"
          placeholder="Search by area, neighborhood…"
          value={search}
          onChangeText={setSearch}
          rightIcon={search ? "x" : undefined}
          onRightIconPress={() => setSearch("")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          <Chip
            icon="sliders"
            label="Filters"
            active={!!(filters.type || filters.rooms || filters.suitability || filters.amenities?.length)}
            onPress={() => setShowFilter(true)}
          />
          <Chip
            icon="map-pin"
            label={filters.area ?? "All areas"}
            active={!!filters.area}
            onPress={() => setFilters({ ...filters, area: undefined })}
          />
          {DHAKA_AREAS.slice(0, 6).map((a) => (
            <Chip
              key={a}
              label={a}
              active={filters.area === a}
              onPress={() =>
                setFilters({
                  ...filters,
                  area: filters.area === a ? undefined : a,
                })
              }
            />
          ))}
        </ScrollView>

        <View>
          <MapView
            listings={visible}
            selectedId={selected?.id}
            onSelect={(id) => setSelectedId(id)}
            height={360}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: colors.background,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Feather name="map-pin" size={12} color={colors.foreground} />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: colors.foreground,
              }}
            >
              {visible.length} listings in view
            </Text>
          </View>
        </View>

        {selected ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/listing/[id]",
                params: { id: selected.id },
              })
            }
            style={{
              flexDirection: "row",
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
            }}
          >
            <Image
              source={PROPERTY_IMAGES[selected.images[0] ?? 0]}
              style={{ width: 110, height: 110, backgroundColor: colors.muted }}
              contentFit="cover"
            />
            <View style={{ flex: 1, padding: 12, gap: 4 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: colors.foreground,
                }}
              >
                {selected.title}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: colors.mutedForeground,
                }}
              >
                {selected.area} · {selected.bedrooms} bed · {selected.bathrooms} bath
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: colors.foreground,
                  marginTop: 4,
                }}
              >
                {formatTaka(selected.rent)}{" "}
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 11,
                    color: colors.mutedForeground,
                  }}
                >
                  / month
                </Text>
              </Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                {selected.suitability.slice(0, 2).map((s) => (
                  <View
                    key={s}
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 5,
                      backgroundColor: colors.muted,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Inter_500Medium",
                        color: colors.foreground,
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: colors.foreground,
            }}
          >
            Nearby ({visible.length})
          </Text>
          <Button
            label="See all"
            variant="ghost"
            small
            icon="arrow-right"
            onPress={() => router.push("/(tabs)/posts")}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 8 }}
        >
          {visible.slice(0, 6).map((l) => (
            <Pressable
              key={l.id}
              onPress={() =>
                router.push({ pathname: "/listing/[id]", params: { id: l.id } })
              }
              style={{
                width: 220,
                borderRadius: colors.radius,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
                backgroundColor: colors.card,
              }}
            >
              <Image
                source={PROPERTY_IMAGES[l.images[0] ?? 0]}
                style={{ width: "100%", height: 130, backgroundColor: colors.muted }}
                contentFit="cover"
              />
              <View style={{ padding: 10, gap: 4 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                    color: colors.foreground,
                  }}
                >
                  {l.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 14,
                    color: colors.foreground,
                  }}
                >
                  {formatTaka(l.rent)}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 11,
                    color: colors.mutedForeground,
                  }}
                >
                  {l.area} · {l.bedrooms} bed
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

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
