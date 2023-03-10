import { Alert, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMutateUsers } from "../queries";
import { ClientUser } from "../shared/types/entities";

export const UserCard = ({
  user,
  onPress,
}: {
  user: ClientUser;
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
          <Text>{user.firstName}</Text>
          <Text className="ml-1">{user.lastName}</Text>
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
            `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`,
            [
              {
                text: "Cancel",
              },
              {
                text: "OK",
                onPress: () => user.id && deleteUser(user.id),
              },
            ],
            { cancelable: false }
          )
        }
      />
    </Pressable>
  );
};
