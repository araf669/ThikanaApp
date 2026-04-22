import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, IconButton, Input } from "@/components/UI";
import { useAuth } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";

export default function Login() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.replace(/[^0-9]/g, "").length < 10) {
      Alert.alert("Invalid number", "Enter a valid phone number.");
      return;
    }
    setLoading(true);
    const code = await requestOtp(phone);
    setLoading(false);
    setHint(`Demo OTP: ${code}`);
    setStep("otp");
  };

  const verify = async () => {
    setLoading(true);
    const ok = await verifyOtp(phone, otp);
    setLoading(false);
    if (!ok) {
      Alert.alert("Wrong code", "The code you entered is incorrect.");
      return;
    }
    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40, paddingHorizontal: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: "row" }}>
        <IconButton name="x" onPress={() => router.back()} />
      </View>

      <View style={{ marginTop: 20, gap: 6 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.foreground,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Feather name="home" size={26} color={colors.background} />
        </View>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 26, color: colors.foreground }}>
          {step === "phone" ? "Welcome to Thikana" : "Verify your number"}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.mutedForeground }}>
          {step === "phone"
            ? "Sign in with your phone to post listings, save properties, and manage your account."
            : `We sent a 4-digit code to ${phone}.`}
        </Text>
      </View>

      <View style={{ marginTop: 28, gap: 14 }}>
        {step === "phone" ? (
          <>
            <Input
              leftIcon="phone"
              placeholder="+8801XXXXXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              autoFocus
            />
            <Button label="Send OTP" icon="arrow-right" loading={loading} onPress={sendOtp} fullWidth />
          </>
        ) : (
          <>
            <Input
              leftIcon="hash"
              placeholder="4-digit code"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
              autoFocus
            />
            {hint ? (
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                {hint}
              </Text>
            ) : null}
            <Button label="Verify & continue" icon="check" loading={loading} onPress={verify} fullWidth />
            <Pressable onPress={() => setStep("phone")} style={{ alignItems: "center", padding: 8 }}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium" }}>
                Use a different number
              </Text>
            </Pressable>
          </>
        )}
      </View>

      <Text
        style={{
          marginTop: 28,
          color: colors.mutedForeground,
          fontFamily: "Inter_400Regular",
          fontSize: 12,
          textAlign: "center",
          lineHeight: 18,
        }}
      >
        By continuing you agree to Thikana&apos;s Terms of Service and Privacy Policy.
      </Text>
    </ScrollView>
  );
}
