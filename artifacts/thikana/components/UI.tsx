import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import {
  Listing,
  PROPERTY_IMAGES,
  formatTaka,
  timeAgo,
} from "@/constants/data";
import { useSaved } from "@/context/AppProviders";
import { useColors } from "@/hooks/useColors";
import { PressableScale } from "@/components/Motion";

// ----------- Button -----------

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export function Button({
  label,
  icon,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
  fullWidth,
  small,
}: {
  label?: string;
  icon?: React.ComponentProps<typeof Feather>["name"];
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  small?: boolean;
}) {
  const colors = useColors();
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "destructive"
        ? colors.destructive
        : variant === "secondary"
          ? colors.secondary
          : "transparent";
  const fg =
    variant === "primary"
      ? colors.primaryForeground
      : variant === "destructive"
        ? colors.destructiveForeground
        : variant === "secondary"
          ? colors.secondaryForeground
          : colors.foreground;
  const border =
    variant === "ghost" ? colors.border : "transparent";

  return (
    <PressableScale
      onPress={() => {
        if (disabled || loading) return;
        onPress?.();
      }}
      disabled={disabled || loading}
      haptic={false}
      style={{
        backgroundColor: bg,
        borderColor: border,
        borderWidth: variant === "ghost" ? 1 : 0,
        borderRadius: colors.radius,
        paddingVertical: small ? 9 : 14,
        paddingHorizontal: small ? 14 : 18,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        opacity: disabled ? 0.45 : 1,
        alignSelf: fullWidth ? "stretch" : "auto",
        ...(style as any),
      }}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {icon ? <Feather name={icon} size={small ? 15 : 17} color={fg} /> : null}
          {label ? (
            <Text
              style={{
                color: fg,
                fontFamily: "Inter_600SemiBold",
                fontSize: small ? 13 : 15,
              }}
            >
              {label}
            </Text>
          ) : null}
        </>
      )}
    </PressableScale>
  );
}

// ----------- IconButton -----------

export function IconButton({
  name,
  onPress,
  size = 22,
  style,
  badge,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
  badge?: number;
}) {
  const colors = useColors();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.9}
      style={{
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        ...(style as any),
      }}
    >
      <Feather name={name} size={size} color={colors.foreground} />
      {badge && badge > 0 ? (
        <View
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            backgroundColor: colors.destructive,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 10,
              fontFamily: "Inter_700Bold",
            }}
          >
            {badge > 9 ? "9+" : badge}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

// ----------- Chip -----------

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ComponentProps<typeof Feather>["name"];
}) {
  const colors = useColors();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? colors.primary : "transparent",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon ? (
        <Feather
          name={icon}
          size={13}
          color={active ? colors.primaryForeground : colors.foreground}
        />
      ) : null}
      <Text
        style={{
          color: active ? colors.primaryForeground : colors.foreground,
          fontFamily: "Inter_500Medium",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

// ----------- Input -----------

export function Input({
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  containerStyle,
  ...rest
}: TextInputProps & {
  leftIcon?: React.ComponentProps<typeof Feather>["name"];
  rightIcon?: React.ComponentProps<typeof Feather>["name"];
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: colors.radius,
          backgroundColor: colors.secondary,
          paddingHorizontal: 12,
          minHeight: 46,
          gap: 8,
        },
        containerStyle,
      ]}
    >
      {leftIcon ? (
        <Feather name={leftIcon} size={17} color={colors.mutedForeground} />
      ) : null}
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={[
          {
            flex: 1,
            fontFamily: "Inter_500Medium",
            color: colors.foreground,
            fontSize: 15,
            paddingVertical: 10,
          },
          style,
        ]}
        {...rest}
      />
      {rightIcon ? (
        <Pressable onPress={onRightIconPress}>
          <Feather name={rightIcon} size={17} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}

// ----------- EmptyState -----------

export function EmptyState({
  icon = "inbox",
  title,
  body,
  action,
}: {
  icon?: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body?: string;
  action?: { label: string; onPress: () => void };
}) {
  const colors = useColors();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.muted,
        }}
      >
        <Feather name={icon} size={26} color={colors.mutedForeground} />
      </View>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 16,
          color: colors.foreground,
          marginTop: 6,
        }}
      >
        {title}
      </Text>
      {body ? (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: colors.mutedForeground,
            textAlign: "center",
            maxWidth: 280,
          }}
        >
          {body}
        </Text>
      ) : null}
      {action ? (
        <View style={{ marginTop: 8 }}>
          <Button label={action.label} onPress={action.onPress} small />
        </View>
      ) : null}
    </View>
  );
}

// ----------- ListingCard -----------

export const ListingCard = React.memo(ListingCardImpl);

function ListingCardImpl({
  listing,
  onPress,
  variant = "list",
}: {
  listing: Listing;
  onPress?: () => void;
  variant?: "list" | "compact";
}) {
  const colors = useColors();
  const saved = useSaved();
  const isSaved = saved.isSaved(listing.id);
  const cover = PROPERTY_IMAGES[listing.images[0] ?? 0];

  return (
    <PressableScale
      onPress={() => {
        if (onPress) onPress();
        else router.push({ pathname: "/listing/[id]", params: { id: listing.id } });
      }}
      scaleTo={0.985}
      style={{
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      <View>
        <Image
          source={cover}
          style={{
            width: "100%",
            height: variant === "compact" ? 140 : 200,
            backgroundColor: colors.muted,
          }}
          contentFit="cover"
        />
        <Pressable
          onPress={() => saved.toggle(listing.id)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name="heart"
            size={17}
            color={isSaved ? colors.destructive : "#0a0a0a"}
          />
        </Pressable>
        {listing.verified ? (
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "rgba(10,10,10,0.85)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Feather name="check-circle" size={11} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
              Verified
            </Text>
          </View>
        ) : null}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.45)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 70,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 12,
            bottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Feather name="map-pin" size={12} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontFamily: "Inter_500Medium",
              fontSize: 12,
            }}
          >
            {listing.area}
          </Text>
        </View>
      </View>
      <View style={{ padding: 14, gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: colors.foreground,
            }}
          >
            {listing.title}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.foreground }}>
            {listing.kind === "stay"
              ? formatTaka(listing.pricePerNight ?? 0)
              : formatTaka(listing.rent)}
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.mutedForeground }}>
            {listing.kind === "stay" ? "/ night" : "/ month"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 2 }}>
          <Stat icon="grid" label={`${listing.bedrooms} bed`} />
          <Stat icon="droplet" label={`${listing.bathrooms} bath`} />
          {listing.kind === "stay" && listing.guestCapacity ? (
            <Stat icon="users" label={`${listing.guestCapacity}`} />
          ) : (
            <Stat icon="layers" label={`${listing.balconies} balcony`} />
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {listing.suitability.slice(0, 3).map((s) => (
            <View
              key={s}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                backgroundColor: colors.muted,
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: colors.foreground }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </View>
          ))}
          {listing.furnished ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                backgroundColor: colors.muted,
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: colors.foreground }}>
                Furnished
              </Text>
            </View>
          ) : null}
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
            {timeAgo(listing.postedAt)}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
}

function Stat({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
}) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Feather name={icon} size={13} color={colors.mutedForeground} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground }}>
        {label}
      </Text>
    </View>
  );
}

// ----------- ScreenHeader -----------

export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
      }}
    >
      {onBack ? (
        <IconButton name="chevron-left" onPress={onBack} />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 22,
            color: colors.foreground,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              color: colors.mutedForeground,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

// ----------- AuthGate -----------

import { useAuth } from "@/context/AppProviders";

export function AuthGate({
  message,
  children,
}: {
  message?: string;
  children: React.ReactNode;
}) {
  const { user, isReady } = useAuth();
  const colors = useColors();
  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.foreground} />
      </View>
    );
  }
  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="lock" size={26} color={colors.mutedForeground} />
        </View>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 17, color: colors.foreground }}>
          Sign in required
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: colors.mutedForeground,
            textAlign: "center",
            maxWidth: 300,
          }}
        >
          {message ?? "You need to be signed in to use this feature."}
        </Text>
        <Button label="Sign in with phone" icon="phone" onPress={() => router.push("/auth/login")} />
      </View>
    );
  }
  return <>{children}</>;
}

export const styles = StyleSheet.create({});
export type _PressableProps = PressableProps;
