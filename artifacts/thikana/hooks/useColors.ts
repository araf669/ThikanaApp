import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useSettings } from "@/context/AppProviders";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Honors the user's in-app theme preference (system / light / dark)
 * from SettingsProvider, falling back to the device color scheme when
 * "system" is selected.
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();
  const effective =
    settings.theme === "system" ? systemScheme : settings.theme;
  const palette = effective === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius, scheme: effective ?? "light" };
}
