import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Social = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  handle: string;
  url: string;
  accent: string;
};

const SOCIALS: Social[] = [
  {
    icon: "mail",
    label: "Email",
    handle: "amiaraf330@gmail.com",
    url: "mailto:amiaraf330@gmail.com",
    accent: "#A78BFA",
  },
  {
    icon: "send",
    label: "Telegram",
    handle: "@hollow6699",
    url: "https://t.me/hollow6699",
    accent: "#60A5FA",
  },
  {
    icon: "github",
    label: "GitHub",
    handle: "@araf669",
    url: "https://github.com/araf669",
    accent: "#E5E7EB",
  },
  {
    icon: "instagram",
    label: "Instagram",
    handle: "@ayeearaf",
    url: "https://instagram.com/ayeearaf",
    accent: "#F472B6",
  },
];

const BG = "#08080A";
const SURFACE = "#0F0F12";
const SURFACE_HI = "#15151A";
const HAIRLINE = "#1E1E24";
const TEXT = "#F5F5F7";
const MUTED = "#8A8A94";
const SOFT = "#B9B9C2";

export default function DeveloperInfoScreen() {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift]);

  const open = async (url: string) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    try {
      await Linking.openURL(url);
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }] }}>
          <View
            style={{
              alignItems: "center",
              paddingTop: 24,
              paddingBottom: 28,
            }}
          >
            <View
              style={{
                width: 116,
                height: 116,
                borderRadius: 58,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: SURFACE_HI,
                borderWidth: 1,
                borderColor: HAIRLINE,
                ...(Platform.OS === "web"
                  ? { boxShadow: "0 0 60px rgba(167,139,250,0.18)" as any }
                  : {
                      shadowColor: "#A78BFA",
                      shadowOpacity: 0.35,
                      shadowRadius: 24,
                      shadowOffset: { width: 0, height: 0 },
                    }),
              }}
            >
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#000",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 38,
                    color: TEXT,
                    letterSpacing: -1,
                  }}
                >
                  A
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#22C55E",
                  borderWidth: 3,
                  borderColor: BG,
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 30,
                color: TEXT,
                marginTop: 18,
                letterSpacing: -0.6,
              }}
            >
              Araf
            </Text>

            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: HAIRLINE,
                backgroundColor: SURFACE,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: SOFT,
                  letterSpacing: 0.3,
                }}
              >
                Developer · Builder · Product Mind
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14.5,
                lineHeight: 22,
                color: MUTED,
                textAlign: "center",
                marginTop: 18,
                paddingHorizontal: 8,
              }}
            >
              Built by Araf — a developer focused on clean design, smooth user experience, and modern products that solve real-life problems.
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: HAIRLINE, marginVertical: 4 }} />

          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 11,
              color: MUTED,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginTop: 22,
              marginBottom: 12,
              marginLeft: 4,
            }}
          >
            Connect
          </Text>

          <View style={{ gap: 10 }}>
            {SOCIALS.map((s) => (
              <Pressable
                key={s.label}
                onPress={() => open(s.url)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  borderRadius: 18,
                  backgroundColor: pressed ? SURFACE_HI : SURFACE,
                  borderWidth: 1,
                  borderColor: HAIRLINE,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                })}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    borderWidth: 1,
                    borderColor: HAIRLINE,
                  }}
                >
                  <Feather name={s.icon} size={18} color={s.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: MUTED,
                      letterSpacing: 0.4,
                    }}
                  >
                    {s.label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 15.5,
                      color: TEXT,
                      marginTop: 2,
                    }}
                  >
                    {s.handle}
                  </Text>
                </View>
                <Feather name="arrow-up-right" size={18} color={MUTED} />
              </Pressable>
            ))}
          </View>

          <View
            style={{
              marginTop: 28,
              padding: 18,
              borderRadius: 20,
              backgroundColor: SURFACE,
              borderWidth: 1,
              borderColor: HAIRLINE,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#A78BFA",
                opacity: 0.7,
                marginBottom: 12,
              }}
            />
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: SOFT,
                textAlign: "center",
                lineHeight: 21,
              }}
            >
              Available for collaboration, product ideas, and creative digital projects.
            </Text>
          </View>

          <Text
            style={{
              textAlign: "center",
              color: MUTED,
              fontFamily: "Inter_400Regular",
              fontSize: 11,
              marginTop: 22,
              letterSpacing: 0.6,
            }}
          >
            Crafted with care · Thikana
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
