import { useColorScheme } from "react-native";
import { Paragraph, Switch, YStack } from "tamagui";

import { useAppTheme } from "../../shared/providers/app-theme-context-provider";
import ScreenContainer from "../../components/screen-container";

export default function Settings() {
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useAppTheme();
  return (
    <ScreenContainer>
      <YStack flex={1} jc="center" ai="center">
        <Paragraph jc="center">device {colorScheme}</Paragraph>
        <Paragraph jc="center">app state {theme}</Paragraph>
        <Switch
          size="$4"
          bg={theme === "dark" ? "$primary" : "$backgroundSoft"}
          onCheckedChange={checked => setTheme(checked ? "dark" : "light")}
          checked={theme === "dark"}>
          <Switch.Thumb animation="quick" />
        </Switch>
      </YStack>
    </ScreenContainer>
  );
}
