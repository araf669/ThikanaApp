import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  PressableProps,
  ViewStyle,
} from "react-native";

const SPRING = { tension: 320, friction: 22, useNativeDriver: true };
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function PressableScale({
  children,
  onPress,
  style,
  haptic = true,
  scaleTo = 0.97,
  disabled,
  ...rest
}: Omit<PressableProps, "children" | "style"> & {
  children?: React.ReactNode;
  haptic?: boolean;
  scaleTo?: number;
  style?: ViewStyle | ViewStyle[];
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        Animated.parallel([
          Animated.spring(scale, { toValue: scaleTo, ...SPRING }),
          Animated.timing(opacity, {
            toValue: 0.92,
            duration: 90,
            easing: EASE,
            useNativeDriver: true,
          }),
        ]).start();
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, ...SPRING }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 140,
            easing: EASE,
            useNativeDriver: true,
          }),
        ]).start();
        rest.onPressOut?.(e);
      }}
      onPress={(e) => {
        if (disabled) return;
        if (haptic && Platform.OS !== "web") {
          Haptics.selectionAsync().catch(() => {});
        }
        onPress?.(e);
      }}
    >
      <Animated.View
        style={[
          { transform: [{ scale }], opacity },
          style as any,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function FadeSlideIn({
  children,
  delay = 0,
  offset = 10,
  duration = 420,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  offset?: number;
  duration?: number;
  style?: ViewStyle | ViewStyle[];
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(offset)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration,
        delay,
        easing: EASE,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration,
        delay,
        easing: EASE,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift, delay, duration]);

  return (
    <Animated.View
      style={[
        { opacity: fade, transform: [{ translateY: lift }] },
        style as any,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function Skeleton({
  width,
  height,
  radius = 12,
  style,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1100,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1100,
          easing: EASE,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "rgba(127,127,127,0.18)",
          opacity,
        },
        style,
      ]}
    />
  );
}
