import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack
      initialRouteName="user-list"
      screenOptions={{
        headerShown: true,
        headerTitle: "Clients",
      }}>
      <Stack.Screen name="user-list" />
      {/* dynamic route, i.e. /users/abcd-123 */}
      <Stack.Screen name="[user]" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
