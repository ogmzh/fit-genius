import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useClientsData } from "../../queries";
import { ClientRow } from "../../shared/types/database";
import { useRouter } from "expo-router";

export default function UserList() {
  const { data, isLoading } = useClientsData();
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

const UserCard = ({
  user,
  onPress,
}: {
  user: ClientRow;
  onPress: () => void;
}) => (
  <Pressable
    className="flex flex-row justify-between rounded-md border-2
   border-slate-200 bg-primary-light py-5 my-2 mx-2 px-4 items-center"
    onPress={onPress}>
    <View className="flex h-8 justify-center">
      <View className="flex flex-row ">
        <Text>{user.first_name}</Text>
        <Text className="ml-1">{user.last_name}</Text>
      </View>
      {user.email && <Text>{user.email}</Text>}
    </View>
    <Ionicons name="trash-bin" size={24} color="purple" />
  </Pressable>
);

const FloatingActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View className="absolute bottom-4 right-4">
      <Pressable
        className="bg-primary-accentLight rounded-md w-12 h-12 flex justify-center items-center"
        onPress={onPress}>
        <Ionicons name="add" size={34} color="white" />
      </Pressable>
    </View>
  );
};
