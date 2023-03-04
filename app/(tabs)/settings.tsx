import { useColorScheme } from "nativewind";
import { View, Text, Switch } from "react-native";
import { useTwColors } from "../shared/hooks";

export default function Settings() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  const { accent, accentLight } = useTwColors();
  return (
    <View className="flex-1 items-center justify-center bg-primary-light dark:bg-primary-dark">
      <Text className="text-lg dark:bg-primary-dark dark:text-primary-light">
        Dark Mode
      </Text>
      <Switch
        thumbColor={accent}
        trackColor={{
          true: accentLight,
        }}
        value={colorScheme === "dark"}
        onValueChange={toggleColorScheme}
      />
    </View>
  );
}
