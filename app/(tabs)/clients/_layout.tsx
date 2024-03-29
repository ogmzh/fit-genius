import { Stack } from "expo-router";
import { useThemedHeaderProps } from "../../../shared/hooks";

export default function UserStack() {
  const { stackHeaderProps } = useThemedHeaderProps();

  return (
    <Stack
      initialRouteName="client-user-list"
      screenOptions={{
        headerTitle: "Clients",
        ...stackHeaderProps,
      }}>
      <Stack.Screen name="client-user-list" />
      <Stack.Screen name="new" />
    </Stack>
  );
}
