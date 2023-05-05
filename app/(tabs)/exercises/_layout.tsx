import { Stack } from "expo-router";
import { useThemedHeaderProps } from "../../../shared/hooks";

export default function ExercisesStack() {
  const { stackHeaderProps } = useThemedHeaderProps();
  console.log("stack");

  return (
    <Stack
      initialRouteName="list"
      screenOptions={{
        headerTitle: "Exercises",
        ...stackHeaderProps,
      }}>
      <Stack.Screen name="list" />
    </Stack>
  );
}
