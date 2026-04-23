import { Feather, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "@/components/Motion";
import { PROPERTY_IMAGES, formatTaka, timeAgo } from "@/constants/data";
import { useListings, useSaved } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function ListingDetail() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useListings();
  const saved = useSaved();
  const [imgIdx, setImgIdx] = useState(0);

  const listing = id ? getById(id) : undefined;

  if (!listing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium" }}>Listing not found.</Text>
      </View>
    );
  }

  const isSaved = saved.isSaved(listing.id);

  const callOwner = () => Linking.openURL(`tel:${listing.contactNumber}`).catch(() => {});
  const textOwner = () => Linking.openURL(`sms:${listing.contactNumber}`).catch(() => {});
  const whatsappOwner = () =>
    Linking.openURL(
      `https://wa.me/${(listing.whatsapp ?? listing.contactNumber).replace(/[^0-9]/g, "")}`,
    ).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image gallery */}
        <View style={{ position: "relative" }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const w = e.nativeEvent.layoutMeasurement.width;
              const i = Math.round(e.nativeEvent.contentOffset.x / w);
              setImgIdx(i);
            }}
            scrollEventThrottle={16}
          >
            {listing.images.map((idx, i) => (
              <Image
                key={i}
                source={PROPERTY_IMAGES[idx % PROPERTY_IMAGES.length]}
                style={{ width: useScreenWidth(), height: 320, backgroundColor: colors.muted }}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          <LinearGradient
            colors={["rgba(0,0,0,0.45)", "transparent"]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100 }}
          />
          <View
            style={{
              position: "absolute",
              top: insets.top + 6,
              left: 12,
              right: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.95)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="chevron-left" size={20} color="#0a0a0a" />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => saved.toggle(listing.id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.95)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="heart" size={18} color={isSaved ? colors.destructive : "#0a0a0a"} />
            </Pressable>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 12,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {listing.images.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === imgIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === imgIdx ? "#fff" : "rgba(255,255,255,0.55)",
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
              {listing.address}
            </Text>
            {listing.verified ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  backgroundColor: colors.muted,
                  borderRadius: 6,
                  marginLeft: 6,
                }}
              >
                <Feather name="check-circle" size={11} color={colors.success} />
                <Text style={{ fontSize: 11, color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                  Verified
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground, lineHeight: 28 }}>
            {listing.title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 24, color: colors.foreground }}>
              {listing.kind === "stay"
                ? formatTaka(listing.pricePerNight ?? 0)
                : formatTaka(listing.rent)}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.mutedForeground }}>
              {listing.kind === "stay" ? "per night" : "per month"}
            </Text>
          </View>

          {listing.kind === "rent" && listing.advance ? (
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
              Advance: {formatTaka(listing.advance)}
            </Text>
          ) : null}

          {/* Attribute grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 4,
            }}
          >
            <Attr icon="grid" label={`${listing.bedrooms} bed`} />
            <Attr icon="droplet" label={`${listing.bathrooms} bath`} />
            <Attr icon="layers" label={`${listing.balconies} balcony`} />
            {listing.drawing ? <Attr icon="square" label="Drawing" /> : null}
            {listing.dining ? <Attr icon="coffee" label="Dining" /> : null}
            <Attr icon={listing.furnished ? "package" : "box"} label={listing.furnished ? "Furnished" : "Unfurnished"} />
            {listing.kind === "stay" && listing.guestCapacity ? (
              <Attr icon="users" label={`${listing.guestCapacity} guests`} />
            ) : null}
          </View>

          <Section title="About this property">
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, color: colors.foreground }}>
              {listing.description}
            </Text>
          </Section>

          <Section title="Suitable for">
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {listing.suitability.map((s) => (
                <View
                  key={s}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: colors.muted,
                  }}
                >
                  <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: colors.foreground }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Amenities">
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {listing.amenities.map((a) => (
                <View
                  key={a}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  }}
                >
                  <Feather name="check" size={13} color={colors.foreground} />
                  <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground }}>
                    {a}
                  </Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Availability">
            <Row icon="calendar" label="Available from" value={listing.availableFrom} />
            {listing.kind === "stay" && listing.minStay ? (
              <Row icon="clock" label="Minimum stay" value={`${listing.minStay} night(s)`} />
            ) : null}
            <Row icon="user" label="Owner" value={listing.ownerName} />
            <Row icon="clock" label="Posted" value={timeAgo(listing.postedAt)} />
          </Section>

          <Section title="Customer service">
            <Pressable
              onPress={() => router.push("/customer-service")}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 14,
                borderRadius: colors.radius,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: pressed ? colors.muted : colors.card,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.muted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="headphones" size={18} color={colors.foreground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground }}>
                  Need help with this listing?
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                  Report fake info, wrong address, or anything suspicious.
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          </Section>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 12,
          paddingHorizontal: 14,
          paddingBottom: insets.bottom + 14,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <ActionPill
          label="Call"
          icon={<Feather name="phone" size={17} color={colors.background} />}
          onPress={callOwner}
          bg={colors.foreground}
          fg={colors.background}
        />
        <ActionPill
          label="Text"
          icon={<Feather name="message-square" size={17} color={colors.foreground} />}
          onPress={() => router.push({ pathname: "/chat/[id]", params: { id: listing.id } })}
          bg="transparent"
          fg={colors.foreground}
          border={colors.border}
        />
        <ActionPill
          label="WhatsApp"
          icon={<FontAwesome name="whatsapp" size={18} color="#FFFFFF" />}
          onPress={whatsappOwner}
          bg="#25D366"
          fg="#FFFFFF"
        />
      </View>
    </View>
  );
}

function ActionPill({
  label,
  icon,
  onPress,
  bg,
  fg,
  border,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  bg: string;
  fg: string;
  border?: string;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.96}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: bg,
        borderWidth: border ? 1 : 0,
        borderColor: border ?? "transparent",
      }}
    >
      {icon}
      <Text style={{ color: fg, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>{label}</Text>
    </PressableScale>
  );
}

function Attr({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.muted,
        borderRadius: 10,
      }}
    >
      <Feather name={icon} size={13} color={colors.foreground} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: colors.foreground }}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 10, marginTop: 8 }}>
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground }}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Feather name={icon} size={14} color={colors.mutedForeground} />
      <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
        {label}
      </Text>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.foreground }}>{value}</Text>
    </View>
  );
}

import { useWindowDimensions } from "react-native";
function useScreenWidth() {
  return useWindowDimensions().width;
}
