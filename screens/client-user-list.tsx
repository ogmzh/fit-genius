import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { Paragraph, Spinner, useTheme, XStack, YStack } from "tamagui";

import { Trash } from "@tamagui/lucide-icons";
import { useQueryClient } from "@tanstack/react-query";

import { ConfirmDialog } from "../components/confirm-dialog";
import { FloatingActionButton } from "../components/floating-action-button";
import ScreenContainer from "../components/screen-container";
import { QUERY_KEYS } from "../queries";
import { useMutateUsers, useUsersData } from "../queries/clients";

export function ClientUserListScreen() {
  const { data, isLoading, isStale } = useUsersData();
  const { danger } = useTheme();

  const queryClient = useQueryClient();
  const { delete: deleteUser } = useMutateUsers();

  const { push } = useRouter();
  return (
    <ScreenContainer>
      <YStack ai="center" jc="center" flex={1}>
        {isLoading ? (
          <Spinner size="large" color="$secondary" />
        ) : (
          <FlatList
            style={{ width: "100%" }}
            data={data?.clients}
            keyExtractor={item => item.id!}
            renderItem={({ item }) => (
              <XStack
                onPress={() => {
                  // preload query data if it's not stale
                  // so we don't have to unnecessarily (p)refetch
                  !isStale &&
                    queryClient.setQueryData(
                      [QUERY_KEYS.clients, item.id],
                      item
                    );
                  push(`clients/${item.id}`);
                }}
                jc="space-between"
                ai="center"
                bg="$backgroundSoft"
                px="$4"
                py="$3"
                mb="$4"
                br="$2"
                mx="$6"
                boc="$backgroundSoft"
                bw="$1"
                pressStyle={{
                  bg: "$backgroundSoftActive",
                }}>
                <YStack>
                  <Paragraph col="$text" fontWeight="bold">
                    {item.firstName} {item.lastName}
                  </Paragraph>
                  <Paragraph col="$textSoft">{item.email}</Paragraph>
                </YStack>
                <ConfirmDialog
                  title="Delete"
                  onConfirm={() => item.id && deleteUser(item.id)}
                  description={`Are you sure you want to delete user ${item.firstName} ${item.lastName}?`}>
                  <Trash color={danger.val} size="$1" />
                </ConfirmDialog>
              </XStack>
            )}
          />
        )}
        <FloatingActionButton onPress={() => push("clients/new")} />
      </YStack>
    </ScreenContainer>
  );
}
