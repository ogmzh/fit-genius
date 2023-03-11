import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props<T> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

const Dropdown = <T,>({ options, value, onChange }: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: T) => {
    console.log("handle select");
    onChange(value);
    setIsOpen(false);
  };
  // implement JSX nativewind select dropdown
  return <></>;
};

export default Dropdown;
