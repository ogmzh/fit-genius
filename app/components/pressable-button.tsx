import React from "react";
import { Pressable, Text } from "react-native";

type ButtonType = "primary" | "secondary" | "default";

type Props = {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  disabled?: boolean;
};

const enabledStyles = (type: ButtonType) =>
  `${
    type === "primary"
      ? "bg-primary-accent active:bg-primary-accentDark"
      : type === "secondary"
      ? "bg-primary-paperLight active:bg-primary-paper"
      : "bg-slate-400 active:bg-slate-500"
  }`;

const PressableButton = ({
  label,
  onPress,
  type = "primary",
  disabled = false,
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`${
        disabled ? "bg-slate-200" : enabledStyles(type)
      } rounded-lg px-5 py-2.5 min-w-[25%]`}>
      <Text className="text-white text-center font-medium text-sm">
        {label}
      </Text>
    </Pressable>
  );
};
export default PressableButton;
