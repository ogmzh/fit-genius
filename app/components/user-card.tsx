import { Alert, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMutateUsers } from "../queries";
import { ClientRow } from "../shared/types/database";

export const UserCard = ({
  user,
  onPress,
}: {
  user: ClientRow;
  onPress: () => void;
}) => {
  const { delete: deleteUser } = useMutateUsers();

  return (
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
      <Ionicons
        name="trash-bin"
        size={24}
        color="purple"
        onPress={() =>
          Alert.alert(
            "Delete",
            `Are you sure you want to delete user ${user.first_name} ${user.last_name}?`,
            [
              {
                text: "Cancel",
              },
              { text: "OK", onPress: () => deleteUser(user.id) },
            ],
            { cancelable: false }
          )
        }
      />
    </Pressable>
  );
};
