import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
} from "react-native";

import { FloatingActionButton } from "../../components/floating-action-button";
import { UserCard } from "../../components/user-card";
import { useUsersData } from "../../queries";

export default function UserList() {
  const { data, isLoading } = useUsersData();

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
            onPress={() => console.log("pressed user", item)}
          />
        )}
        keyExtractor={item => item.id}
      />
      <FloatingActionButton onPress={() => push("/users/user-form")} />
    </SafeAreaView>
  );
}
