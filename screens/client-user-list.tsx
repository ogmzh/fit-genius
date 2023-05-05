import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { Button, Spinner, YStack } from "tamagui";

import { Trash } from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";

import { ClientCard } from "../components/client-card";
import { ConfirmDialog } from "../components/confirm-dialog";
import { FloatingActionButton } from "../components/floating-action-button";
import ScreenContainer from "../components/screen-container";
import { QUERY_KEYS } from "../queries";
import { useMutateUsers, useUsersData } from "../queries/clients";
import { DebouncedInput } from "../components/debounced-input";
import useSearch from "../shared/hooks/use-search";
import { ClientUser } from "../shared/types/entities";

export function ClientUserListScreen() {
  const { data, isLoading, isStale } = useUsersData();

  const {
    results: filteredClients,
    searchQuery,
    search,
  } = useSearch<ClientUser>({
    data: data?.clients ?? [],
    keys: ["firstName", "lastName", "email"],
    filter: null,
  });

  const queryClient = useQueryClient();
  const { delete: deleteUser } = useMutateUsers();

  const { push } = useRouter();
  return (
    <ScreenContainer>
      <YStack ai="center" jc="center" flex={1}>
        {isLoading ? (
          <Spinner size="large" color="$secondary" />
        ) : (
          <>
            <DebouncedInput
              containerProps={{
                mb: "$4",
                mx: "$6",
              }}
              inputProps={{
                placeholder: "Search...",
              }}
              value={searchQuery}
              onValueChange={value => search(value)}
            />
            <FlatList
              style={{ width: "100%" }}
              data={filteredClients}
              keyExtractor={item => item.id!}
              renderItem={({ item }) => (
                <ClientCard
                  key={item.id}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  email={item.email}
                  onPress={() => {
                    // preload query data if it's not stale
                    // so we don't have to unnecessarily (p)refetch
                    !isStale &&
                      queryClient.setQueryData(
                        [QUERY_KEYS.clients, item.id],
                        item
                      );
                    push(`clients/${item.id}`);
                  }}>
                  <ConfirmDialog
                    title="Delete"
                    onConfirm={() => item.id && deleteUser(item.id)}
                    description={`Are you sure you want to delete user ${item.firstName} ${item.lastName}?`}>
                    <Button
                      circular
                      size="$3"
                      icon={Trash}
                      backgroundColor="$danger"
                      color="white"
                      pressStyle={{
                        bg: "$error",
                      }}
                    />
                  </ConfirmDialog>
                </ClientCard>
              )}
            />
          </>
        )}
        <FloatingActionButton onPress={() => push("clients/new")} />
      </YStack>
    </ScreenContainer>
  );
}
