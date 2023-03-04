import { useColorScheme } from "nativewind";
import { View, Text } from "react-native";

export default function TabOneScreen() {
  const { toggleColorScheme, colorScheme } = useColorScheme();

  return (
    <View className="flex-1 items-center justify-center bg-primary-light dark:bg-primary-dark">
      <Text
        onPress={toggleColorScheme}
        className="text-lg dark:bg-primary-dark dark:text-primary-light">
        users grgrgr
      </Text>
      <Text className="mt-2 text-lg dark:text-primary-light">
        {colorScheme}
      </Text>
    </View>
  );
}
