import { useMemo } from "react";
import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useSettings } from "@/context/AppProviders";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Memoized so consumers don't re-render unless the effective scheme changes.
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();
  const effective =
    settings.theme === "system" ? systemScheme : settings.theme;

  return useMemo(
    () => ({
      ...(effective === "dark" ? colors.dark : colors.light),
      radius: colors.radius,
      scheme: (effective ?? "light") as "light" | "dark",
    }),
    [effective],
  );
}
