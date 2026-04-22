import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";

import { Button, Input } from "@/components/UI";
import { useColors } from "@/hooks/useColors";

export default function CustomerService() {
  const colors = useColors();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    Alert.alert(
      "Message sent",
      "Thanks for reaching out. Our support team will respond within 24 hours.",
    );
    setTopic("");
    setMessage("");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          padding: 16,
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 6,
        }}
      >
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground }}>
          We&apos;re here to help
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground }}>
          Get in touch with the Thikana team. We respond to most messages within 24 hours.
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionTile
          icon="phone"
          label="Call us"
          sub="+880 9612-345678"
          onPress={() => Linking.openURL("tel:+8809612345678").catch(() => {})}
        />
        <ActionTile
          icon="mail"
          label="Email"
          sub="help@thikana.bd"
          onPress={() => Linking.openURL("mailto:help@thikana.bd").catch(() => {})}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionTile
          icon="message-circle"
          label="WhatsApp"
          sub="9 AM – 9 PM"
          onPress={() => Linking.openURL("https://wa.me/8809612345678").catch(() => {})}
        />
        <ActionTile
          icon="alert-triangle"
          label="Report listing"
          sub="Trust & safety"
          onPress={() =>
            Alert.alert("Thank you", "Open any listing and tap Customer service to report it.")
          }
        />
      </View>

      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground, marginTop: 8 }}>
        Send us a message
      </Text>
      <Input leftIcon="tag" placeholder="Topic (e.g. payment, listing review)" value={topic} onChangeText={setTopic} />
      <Input
        leftIcon="message-square"
        placeholder="How can we help you?"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        containerStyle={{ minHeight: 120, alignItems: "flex-start", paddingTop: 8 }}
        style={{ minHeight: 100, textAlignVertical: "top" }}
      />
      <Button
        label="Send message"
        icon="send"
        onPress={submit}
        disabled={!topic.trim() || !message.trim()}
        fullWidth
      />

      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground, marginTop: 8 }}>
        Frequently asked
      </Text>
      <FAQ q="How do I post a rental?" a="Go to More → Post a listing, fill in the details, and submit. Our team reviews each post for quality." />
      <FAQ q="Are the listings verified?" a="Listings marked with a check badge have been verified by our team — including the address and owner." />
      <FAQ q="Is there any fee?" a="Browsing and posting are free. We never take a commission from rent payments between owners and tenants." />
      <FAQ q="How do I edit my listing?" a="Open More → My listings, tap the listing you want to update or remove." />
    </ScrollView>
  );
}

function ActionTile({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  sub: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        padding: 14,
        borderRadius: colors.radius,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.muted : colors.card,
        gap: 6,
      })}
    >
      <Feather name={icon} size={20} color={colors.foreground} />
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground }}>{label}</Text>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>{sub}</Text>
    </Pressable>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      style={{
        padding: 14,
        borderRadius: colors.radius,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.foreground }}>
          {q}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
      </View>
      {open ? (
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground, lineHeight: 20 }}>
          {a}
        </Text>
      ) : null}
    </Pressable>
  );
}
