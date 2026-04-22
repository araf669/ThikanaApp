import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

import { ListingCard } from "@/components/UI";
import { useListings, useSaved } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function SavedScreen() {
  const colors = useColors();
  const saved = useSaved();
  const { all } = useListings();

  const items = all.filter((l) => saved.ids.includes(l.id));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60, gap: 8 }}>
            <Feather name="bookmark" size={28} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
              You haven&apos;t saved any properties yet.
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}>
              Tap the heart on any listing to save it for later.
            </Text>
          </View>
        }
      />
    </View>
  );
}
