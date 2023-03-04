import { useColorScheme } from "nativewind";

export const useTwColors = () => {
  const { colorScheme } = useColorScheme();

  // maintain these colors with tailwind.config.js
  return {
    backgroundColor: colorScheme === "dark" ? "#0F172A" : "#ffffff",
    textColor: colorScheme === "dark" ? "#ffffff" : "#0F172A",
    paper: "#1E293B",
    accent: "#0EA5E9",
    accentLight: "#38bdf8",
  };
};
