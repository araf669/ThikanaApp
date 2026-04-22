import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function About() {
  const colors = useColors();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, gap: 18 }}
    >
      <View style={{ alignItems: "center", gap: 10, paddingVertical: 16 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.foreground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="home" size={32} color={colors.background} />
        </View>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>
          Thikana
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground }}>
          Version 1.0.0
        </Text>
      </View>

      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 24, color: colors.foreground }}>
        Thikana — meaning &ldquo;address&rdquo; in Bangla — is a modern way to discover, post, and book
        homes across Bangladesh. Whether you&apos;re hunting for a long-term flat near your office,
        a bachelor pad close to your campus, or a short stay for the weekend, Thikana brings
        every option together in one trusted app.
      </Text>

      <View style={{ gap: 10 }}>
        <Card icon="map" title="Map-first discovery" body="Browse rentals across Dhaka and beyond on a familiar map." />
        <Card icon="check-circle" title="Verified listings" body="Our team reviews every post for accuracy and trust." />
        <Card icon="moon" title="Short stays" body="Find places by the night with the same trusted experience." />
        <Card icon="phone" title="Direct contact" body="Call, message, or WhatsApp owners — no middleman fees." />
      </View>

      <Text
        style={{
          textAlign: "center",
          color: colors.mutedForeground,
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          marginTop: 12,
        }}
      >
        Made with care in Dhaka.
      </Text>
    </ScrollView>
  );
}

function Card({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body: string;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 14,
        borderRadius: colors.radius,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
      }}
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
        <Feather name={icon} size={18} color={colors.foreground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground }}>
          {title}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
          {body}
        </Text>
      </View>
    </View>
  );
}
