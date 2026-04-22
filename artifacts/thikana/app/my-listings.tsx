import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import { AuthGate, Button, ListingCard } from "@/components/UI";
import { useAuth, useListings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function MyListingsScreen() {
  return (
    <AuthGate message="Sign in to manage your listings.">
      <Inner />
    </AuthGate>
  );
}

function Inner() {
  const colors = useColors();
  const { user } = useAuth();
  const { all, removeListing } = useListings();
  const mine = all.filter((l) => l.ownerId === user?.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={mine}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        ListHeaderComponent={
          <Button
            label="Post a new listing"
            icon="plus"
            onPress={() => router.push("/create-listing")}
            fullWidth
          />
        }
        renderItem={({ item }) => (
          <View style={{ gap: 8 }}>
            <ListingCard
              listing={item}
              onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Pressable
                  onPress={() =>
                    Alert.alert("Delete listing", "Are you sure you want to delete this listing?", [
                      { text: "Cancel" },
                      { text: "Delete", style: "destructive", onPress: () => removeListing(item.id) },
                    ])
                  }
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: 10,
                    borderRadius: colors.radius,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: pressed ? colors.muted : "transparent",
                  })}
                >
                  <Feather name="trash-2" size={14} color={colors.destructive} />
                  <Text style={{ fontFamily: "Inter_500Medium", color: colors.destructive, fontSize: 13 }}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60, gap: 8 }}>
            <Feather name="list" size={28} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
              You haven&apos;t posted any listings yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}
