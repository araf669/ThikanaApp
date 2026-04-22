import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { AuthGate, Button, Input } from "@/components/UI";
import { useAuth } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function Profile() {
  return (
    <AuthGate message="Sign in to view your profile.">
      <ProfileForm />
    </AuthGate>
  );
}

function ProfileForm() {
  const colors = useColors();
  const { user, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [editing, setEditing] = useState(false);

  const save = async () => {
    await updateProfile({ name: name.trim(), email: email.trim() });
    setEditing(false);
    Alert.alert("Saved", "Your profile was updated.");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <View
        style={{
          alignItems: "center",
          padding: 22,
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 8,
        }}
      >
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: colors.foreground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.background, fontFamily: "Inter_700Bold", fontSize: 30 }}>
            {(user?.name ?? user?.phone ?? "?").trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 18, color: colors.foreground }}>
          {user?.name ?? "Set your name"}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.mutedForeground }}>
          {user?.phone}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ flex: 1, fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground }}>
            Personal info
          </Text>
          <Pressable onPress={() => setEditing((v) => !v)}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium" }}>
              {editing ? "Cancel" : "Edit"}
            </Text>
          </Pressable>
        </View>
        <Input
          leftIcon="user"
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          editable={editing}
        />
        <Input
          leftIcon="mail"
          placeholder="Email (optional)"
          value={email}
          onChangeText={setEmail}
          editable={editing}
          keyboardType="email-address"
        />
        {editing ? <Button label="Save changes" icon="check" onPress={save} fullWidth /> : null}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.foreground }}>
          Quick links
        </Text>
        <Row icon="bookmark" label="Saved properties" onPress={() => router.push("/saved")} />
        <Row icon="list" label="My listings" onPress={() => router.push("/my-listings")} />
        <Row icon="bell" label="Notifications" onPress={() => router.push("/notifications")} />
        <Row icon="settings" label="App settings" onPress={() => router.push("/settings")} />
      </View>

      <Button label="Logout" icon="log-out" variant="ghost" onPress={signOut} fullWidth />
    </ScrollView>
  );
}

function Row({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        backgroundColor: pressed ? colors.muted : colors.card,
        borderRadius: colors.radius,
        borderWidth: 1,
        borderColor: colors.border,
      })}
    >
      <Feather name={icon} size={18} color={colors.foreground} />
      <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 15, color: colors.foreground }}>
        {label}
      </Text>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}
