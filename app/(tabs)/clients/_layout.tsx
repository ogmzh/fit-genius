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
      {/* dynamic route, i.e. /users/abcd-123 */}
      <Stack.Screen name="[id]" />
      <Stack.Screen name="new" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
