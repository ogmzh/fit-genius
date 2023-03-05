import React from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

type Props = {
  onChange: (value: string) => void;
  value: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  errorText?: string;
  regexPattern?: RegExp;
  onPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  numberOfLines?: number;
};

const TextFormInput = ({
  value,
  onChange,
  label,
  placeholder,
  required,
  errorText,
  regexPattern,
  numberOfLines,
  onPress,
  keyboardType = "default",
}: Props) => {
  return (
    <View className="flex w-full">
      <View className="flex-row mb-1 items-center">
        {label && (
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </Text>
        )}
        {required && <Text className="text-red-900 ml-1 text-lg">*</Text>}
      </View>
      <TextInput
        onPressIn={onPress}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={value =>
          regexPattern
            ? value.match(regexPattern) && onChange(value)
            : onChange(value)
        }
        className="bg-slate-50 border border-slate-300 text-gray-900 text-sm rounded-lg focus:ring-primary-accent
        focus:border-primary-accent w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
      />
      {errorText && (
        <Text className="text-sm text-red-700">{errorText}</Text>
      )}
    </View>
  );
};

export default TextFormInput;
