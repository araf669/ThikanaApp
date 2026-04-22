import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

import { useSettings } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const { settings, update } = useSettings();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Section title="Appearance">
        <Choice
          label="Theme"
          options={[
            { v: "system", l: "System" },
            { v: "light", l: "Light" },
            { v: "dark", l: "Dark" },
          ]}
          value={settings.theme}
          onChange={(v) => update({ theme: v as any })}
        />
      </Section>

      <Section title="Notifications">
        <Toggle
          icon="bell"
          label="Push notifications"
          value={settings.pushEnabled}
          onChange={(v) => update({ pushEnabled: v })}
        />
        <Toggle
          icon="mail"
          label="Email updates"
          value={settings.emailEnabled}
          onChange={(v) => update({ emailEnabled: v })}
        />
        <Toggle
          icon="zap"
          label="New listing alerts in saved areas"
          value={settings.alertNewListings}
          onChange={(v) => update({ alertNewListings: v })}
        />
      </Section>

      <Section title="Search preferences">
        <Choice
          label="Default sort"
          options={[
            { v: "newest", l: "Newest" },
            { v: "lowest", l: "Lowest price" },
            { v: "highest", l: "Highest price" },
          ]}
          value={settings.defaultSort}
          onChange={(v) => update({ defaultSort: v as any })}
        />
        <Choice
          label="Distance unit"
          options={[
            { v: "km", l: "Kilometers" },
            { v: "mi", l: "Miles" },
          ]}
          value={settings.distanceUnit}
          onChange={(v) => update({ distanceUnit: v as any })}
        />
      </Section>

      <Section title="Privacy">
        <Toggle
          icon="map-pin"
          label="Use device location"
          value={settings.locationEnabled}
          onChange={(v) => update({ locationEnabled: v })}
        />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 13,
          color: colors.mutedForeground,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Toggle({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <Feather name={icon} size={18} color={colors.foreground} />
      <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 14, color: colors.foreground }}>
        {label}
      </Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        padding: 14,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.foreground }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const active = o.v === value;
          return (
            <Pressable
              key={o.v}
              onPress={() => onChange(o.v)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: active ? colors.foreground : "transparent",
                borderWidth: 1,
                borderColor: active ? colors.foreground : colors.border,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: active ? colors.background : colors.foreground,
                }}
              >
                {o.l}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
