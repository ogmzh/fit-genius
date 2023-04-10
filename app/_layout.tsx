/* eslint-disable unicorn/prefer-module */
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";
import { TamaguiProvider, Theme } from "tamagui";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  AppThemeContext,
  AppThemeContextProvider,
} from "../shared/providers/app-theme-context-provider";
import { SupabaseClientProvider } from "../shared/supabase.provider";
import client from "../supabase";
import config from "../tamagui.config";
import { toastConfig } from "../shared/toast";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10_000,
    },
  },
});

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (error) {
    console.warn("font error:", error);
  }

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  if (!loaded) {
    return null;
  }

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  return (
    <TamaguiProvider config={config}>
      <AppThemeContextProvider>
        <AppThemeContext.Consumer>
          {({ theme }) => (
            <Theme name={theme}>
              <SupabaseClientProvider client={client}>
                <QueryClientProvider client={queryClient}>
                  <>
                    <Stack>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                    <StatusBar
                      style={theme === "dark" ? "light" : "dark"}
                    />
                  </>
                </QueryClientProvider>
              </SupabaseClientProvider>
            </Theme>
          )}
        </AppThemeContext.Consumer>
      </AppThemeContextProvider>
      <Toast config={toastConfig} />
    </TamaguiProvider>
  );
}
