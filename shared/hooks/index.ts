import { useTheme } from "tamagui";

export const useThemedHeaderProps = () => {
  const { background, text } = useTheme();
  return {
    tabHeaderProps: {
      headerStyle: {
        backgroundColor: background.val,
        shadowColor: "transparent",
      },
      headerTitleStyle: {
        color: text.val,
      },
    },
    stackHeaderProps: {
      headerShadowVisible: false,
      headerTintColor: text.val,
      headerStyle: {
        backgroundColor: background.val,
      },
      headerTitleStyle: {
        color: text.val,
      },
    },
  };
};
