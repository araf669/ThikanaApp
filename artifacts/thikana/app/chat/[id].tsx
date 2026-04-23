import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "@/components/Motion";
import { ListingCard } from "@/components/UI";
import { useListings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

type Msg = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

function initialMessages(name: string): Msg[] {
  return [
    {
      id: "m1",
      text: `Assalamu alaikum, this is ${name}. How can I help you?`,
      mine: false,
      time: "10:24",
    },
    {
      id: "m2",
      text: "Hi! Is this property still available?",
      mine: true,
      time: "10:25",
    },
    {
      id: "m3",
      text: "Yes, it is. When would you like to visit?",
      mine: false,
      time: "10:26",
    },
  ];
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = colors.scheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, rentals, stays } = useListings();
  const listing = id ? getById(id) : undefined;
  const [messages, setMessages] = useState<Msg[]>(() =>
    initialMessages(listing?.ownerName ?? "Owner"),
  );
  const [draft, setDraft] = useState("");
  const [sheet, setSheet] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  const ownerListings = useMemo(() => {
    if (!listing) return [];
    return [...rentals, ...stays].filter(
      (l) => l.ownerName === listing.ownerName,
    );
  }, [listing, rentals, stays]);

  if (!listing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.foreground }}>Conversation not found.</Text>
      </View>
    );
  }

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: `u-${prev.length}`, text, mine: true, time }]);
    setDraft("");
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `r-${prev.length}`,
          text: "Got it. I'll get back to you shortly.",
          mine: false,
          time,
        },
      ]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    }, 900);
  };

  const callOwner = () => Linking.openURL(`tel:${listing.contactNumber}`).catch(() => {});

  const initials = listing.ownerName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingBottom: 12,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <PressableScale onPress={() => router.back()} scaleTo={0.9} style={{ padding: 6 }}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </PressableScale>

        <Pressable
          onPress={() => setSheet(true)}
          style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 12 }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: colors.muted,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.foreground }}>
              {initials}
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#22C55E",
                borderWidth: 2,
                borderColor: colors.background,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: colors.foreground }}>
              {listing.ownerName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" }} />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11.5, color: colors.mutedForeground }}>
                Active now
              </Text>
            </View>
          </View>
        </Pressable>

        <PressableScale
          onPress={callOwner}
          scaleTo={0.9}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.foreground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="phone" size={17} color={colors.background} />
        </PressableScale>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 14, gap: 8, paddingBottom: 20 }}
          renderItem={({ item }) => <Bubble msg={item} />}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Composer */}
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: insets.bottom + 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.secondary,
              borderRadius: 24,
              paddingHorizontal: 14,
              paddingVertical: Platform.OS === "ios" ? 10 : 6,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 8,
            }}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={{
                flex: 1,
                color: colors.foreground,
                fontFamily: "Inter_400Regular",
                fontSize: 15,
                maxHeight: 110,
                paddingVertical: 4,
              }}
            />
          </View>
          <PressableScale
            onPress={send}
            disabled={!draft.trim()}
            scaleTo={0.88}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: draft.trim() ? colors.foreground : colors.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-up" size={20} color={draft.trim() ? colors.background : colors.mutedForeground} />
          </PressableScale>
        </View>
      </KeyboardAvoidingView>

      {/* Seller profile sheet */}
      <SellerSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        owner={{
          id: listing.ownerId ?? listing.ownerName,
          name: listing.ownerName,
          phone: listing.contactNumber,
          area: listing.area,
          verified: !!listing.verified,
          listingsCount: ownerListings.length,
          listings: ownerListings,
          initials,
        }}
        isDark={isDark}
        onCall={callOwner}
      />
    </View>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const colors = useColors();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(6)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fade, lift]);

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [{ translateY: lift }],
        alignSelf: msg.mine ? "flex-end" : "flex-start",
        maxWidth: "82%",
      }}
    >
      <View
        style={{
          backgroundColor: msg.mine ? colors.foreground : colors.card,
          borderWidth: msg.mine ? 0 : 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 18,
          borderBottomRightRadius: msg.mine ? 6 : 18,
          borderBottomLeftRadius: msg.mine ? 18 : 6,
        }}
      >
        <Text
          style={{
            color: msg.mine ? colors.background : colors.foreground,
            fontFamily: "Inter_400Regular",
            fontSize: 14.5,
            lineHeight: 20,
          }}
        >
          {msg.text}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 10.5,
          color: colors.mutedForeground,
          marginTop: 3,
          marginHorizontal: 6,
          textAlign: msg.mine ? "right" : "left",
        }}
      >
        {msg.time}
      </Text>
    </Animated.View>
  );
}

function SellerSheet({
  visible,
  onClose,
  owner,
  isDark,
  onCall,
}: {
  visible: boolean;
  onClose: () => void;
  owner: {
    id: string;
    name: string;
    phone: string;
    area: string;
    verified: boolean;
    listingsCount: number;
    listings: any[];
    initials: string;
  };
  isDark: boolean;
  onCall: () => void;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "84%",
                overflow: "hidden",
              }}
            >
              <View style={{ alignItems: "center", paddingTop: 10 }}>
                <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong }} />
              </View>

              <FlatList
                data={owner.listings}
                keyExtractor={(l) => l.id}
                contentContainerStyle={{ padding: 18, paddingBottom: 28, gap: 12 }}
                ListHeaderComponent={
                  <View style={{ gap: 14, marginBottom: 6 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: colors.muted,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>
                          {owner.initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 19, color: colors.foreground }}>
                            {owner.name}
                          </Text>
                          {owner.verified ? (
                            <Feather name="check-circle" size={15} color={colors.success} />
                          ) : null}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" }} />
                          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>
                            Active now · Replies in ~10 min
                          </Text>
                        </View>
                        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11.5, color: colors.mutedForeground, marginTop: 2 }}>
                          ID · {owner.id.slice(0, 10)}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Stat label="Listings" value={String(owner.listingsCount)} colors={colors} />
                      <Stat label="Member" value="2024" colors={colors} />
                      <Stat label="Area" value={owner.area} colors={colors} />
                    </View>

                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <PressableScale
                        onPress={onCall}
                        scaleTo={0.96}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          backgroundColor: colors.foreground,
                          paddingVertical: 12,
                          borderRadius: 14,
                        }}
                      >
                        <Feather name="phone" size={15} color={colors.background} />
                        <Text style={{ color: colors.background, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                          Call
                        </Text>
                      </PressableScale>
                      <PressableScale
                        onPress={onClose}
                        scaleTo={0.96}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          backgroundColor: "transparent",
                          paddingVertical: 12,
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Feather name="message-square" size={15} color={colors.foreground} />
                        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                          Message
                        </Text>
                      </PressableScale>
                    </View>

                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 12,
                        color: colors.mutedForeground,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginTop: 12,
                      }}
                    >
                      Active listings
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <ListingCard
                    listing={item}
                    onPress={() => {
                      onClose();
                      setTimeout(
                        () => router.push({ pathname: "/listing/[id]", params: { id: item.id } }),
                        220,
                      );
                    }}
                  />
                )}
                ListEmptyComponent={
                  <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>
                    No other active listings.
                  </Text>
                }
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground }} numberOfLines={1}>
        {value}
      </Text>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
