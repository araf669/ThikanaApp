import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { Listing } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

/**
 * Cross-platform stylized "map" view. Renders a clean grid background and
 * positions listing pins by mapping lat/lng into the available canvas. This
 * keeps the experience identical on iOS, Android, and Web without any
 * native-only dependencies.
 */
export function MapView({
  listings,
  selectedId,
  onSelect,
  height = 360,
}: {
  listings: Listing[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: number;
}) {
  const colors = useColors();

  const bounds = useMemo(() => {
    if (!listings.length)
      return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    let minLat = Infinity,
      maxLat = -Infinity,
      minLng = Infinity,
      maxLng = -Infinity;
    for (const l of listings) {
      if (l.lat < minLat) minLat = l.lat;
      if (l.lat > maxLat) maxLat = l.lat;
      if (l.lng < minLng) minLng = l.lng;
      if (l.lng > maxLng) maxLng = l.lng;
    }
    const padLat = (maxLat - minLat) * 0.2 || 0.02;
    const padLng = (maxLng - minLng) * 0.2 || 0.02;
    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLng: minLng - padLng,
      maxLng: maxLng + padLng,
    };
  }, [listings]);

  const grid = Array.from({ length: 8 });

  return (
    <View
      style={{
        height,
        backgroundColor: colors.mapSurface,
        borderRadius: colors.radius,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Subtle grid */}
      <View style={{ position: "absolute", inset: 0 } as any}>
        {grid.map((_, i) => (
          <View
            key={`h${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(i / grid.length) * 100}%`,
              height: 1,
              backgroundColor: colors.mapStroke,
            }}
          />
        ))}
        {grid.map((_, i) => (
          <View
            key={`v${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(i / grid.length) * 100}%`,
              width: 1,
              backgroundColor: colors.mapStroke,
            }}
          />
        ))}
      </View>

      {/* Faux roads */}
      <View
        style={{
          position: "absolute",
          left: "12%",
          right: "8%",
          top: "55%",
          height: 6,
          backgroundColor: colors.background,
          borderRadius: 3,
          opacity: 0.7,
          transform: [{ rotate: "-8deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          left: "30%",
          width: 6,
          top: "10%",
          bottom: "10%",
          backgroundColor: colors.background,
          borderRadius: 3,
          opacity: 0.7,
        }}
      />

      {listings.map((l) => {
        const x =
          ((l.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
        const y =
          (1 - (l.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) *
          100;
        const isSel = selectedId === l.id;
        return (
          <Pressable
            key={l.id}
            onPress={() => onSelect?.(l.id)}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: [{ translateX: -18 }, { translateY: -36 }],
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: isSel ? colors.primary : colors.background,
                borderWidth: 1,
                borderColor: isSel ? colors.primary : colors.borderStrong,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              }}
            >
              <Feather
                name="home"
                size={11}
                color={isSel ? colors.primaryForeground : colors.foreground}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter_700Bold",
                  color: isSel ? colors.primaryForeground : colors.foreground,
                }}
              >
                ৳{Math.round(
                  (l.kind === "stay" ? l.pricePerNight ?? 0 : l.rent) / 1000,
                )}
                k
              </Text>
            </View>
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 5,
                borderRightWidth: 5,
                borderTopWidth: 6,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: isSel ? colors.primary : colors.background,
                marginTop: -1,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
