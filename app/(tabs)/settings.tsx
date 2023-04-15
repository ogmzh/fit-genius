import { useColorScheme } from "react-native";
import { Paragraph, YStack } from "tamagui";

import { useAppTheme } from "../../shared/providers/app-theme-context-provider";
import ScreenContainer from "../../components/screen-container";
import { ThumbSwitch } from "../../components/thumb-switch";

export default function Settings() {
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useAppTheme();
  return (
    <ScreenContainer>
      <YStack flex={1} jc="center" ai="center">
        <Paragraph jc="center">device {colorScheme}</Paragraph>
        <Paragraph jc="center">app state {theme}</Paragraph>
        <ThumbSwitch
          value={theme === "dark"}
          onValueChange={checked => setTheme(checked ? "dark" : "light")}
        />
      </YStack>
    </ScreenContainer>
  );
}
