import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Text, View } from "react-native";

export default function App() {
  const { toggleColorScheme, colorScheme } = useColorScheme();
  useState();
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-800">
      <Text
        onPress={toggleColorScheme}
        className="text-lg dark:text-sky-50">
        Open up App.tsx to start working on your app!
      </Text>
      <Text className="mt-2 text-lg dark:text-sky-50">{colorScheme}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
