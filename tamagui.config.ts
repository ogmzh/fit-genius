import { createInterFont } from "@tamagui/font-inter";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";
import { createAnimations } from "@tamagui/animations-react-native";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  smooth: {
    type: "spring",
    damping: 50,
    mass: 0.2,
    stiffness: 700,
  },
});

const headingFont = createInterFont();
const bodyFont = createInterFont();

const darkTheme = {
  primary: "#DB774A",
  primaryActive: "#e68a60",
  secondary: "#525FEA",
  secondarySoft: "#6369b0",
  accent: "#0FF1A5",
  accentActive: "#74f2c8",
  background: "#1D1D2B",
  backgroundSoft: "#343752",
  backgroundSoftActive: "#3e415e",
  backgroundDisabled: "#969595",
  text: "#f8f9fa",
  textSoft: "#ababab",
  textSofter: "#7c7e91",
  textDisabled: "#ababab",
  info: "#5172EB",
  warning: "#E86150",
  error: "#f44336",
  danger: "#f00c0c",
  icon: "#f8f9fa",
};

const lightTheme = {
  primary: "#f28250",
  primaryActive: "#c26034",
  secondary: "#525FEA",
  secondarySoft: "#6369b0",
  accent: "#0dd692",
  accentActive: "#0bb078",
  background: "#FFFFFF",
  backgroundSoft: "#f3f3f3",
  backgroundSoftActive: "#dbdbdb",
  backgroundDisabled: "#ededed",
  text: "#0c021a",
  textSoft: "#210a40",
  textSofter: "#8f8799",
  textDisabled: "#d0d0d0",
  info: "#93a7ed",
  warning: "#E86150",
  error: "#f44336",
  danger: "#f00c0c",
  icon: "#210a40",
};

const config = createTamagui({
  animations,
  defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    dark: {
      ...themes.dark,
      ...darkTheme,
    },
    light: {
      ...themes.light,
      ...lightTheme,
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
