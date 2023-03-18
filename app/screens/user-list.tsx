import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
} from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { FloatingActionButton } from "../components/floating-action-button";
import { UserCard } from "../components/user-card";
import { QUERY_KEYS } from "../queries";
import { useUsersData } from "../queries/clients";

export default function UserListScreen() {
  const { data, isLoading, isStale } = useUsersData();

  const queryClient = useQueryClient();

  const { push } = useRouter();
  return (
    <SafeAreaView className="flex flex-1 py-4 bg-slate-100 dark:bg-primary-dark">
      {isLoading && (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={data?.clients}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => {
              // preload query data if it's not stale
              // so we don't have to unnecessarily (p)refetch
              !isStale &&
                queryClient.setQueryData(
                  [QUERY_KEYS.clients, item.id],
                  item
                );
              push(`users/${item.id}`);
            }}
          />
        )}
        keyExtractor={item => item.id!}
      />
      <FloatingActionButton onPress={() => push("users")} />
    </SafeAreaView>
  );
}
