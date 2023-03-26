import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const FloatingActionButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <View>
      <Pressable onPress={onPress}>
        <Ionicons name="add" size={34} color="white" />
      </Pressable>
    </View>
  );
};
