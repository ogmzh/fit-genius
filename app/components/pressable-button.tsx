import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "default";
};

const PressableButton = ({ label, onPress, type = "primary" }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className={`${
        type === "primary"
          ? "bg-primary-accent active:bg-primary-accentDark"
          : type === "secondary"
          ? "bg-primary-paperLight active:bg-primary-paper"
          : "bg-slate-400 active:bg-slate-500"
      } rounded-lg px-5 py-2.5 min-w-[25%]`}>
      <Text className="text-white text-center font-medium text-sm">
        {label}
      </Text>
    </Pressable>
  );
};
export default PressableButton;
