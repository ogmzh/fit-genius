import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const FloatingActionButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
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
