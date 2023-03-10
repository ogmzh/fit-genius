import React from "react";
import { useController } from "react-hook-form";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  numberOfLines?: number;
};

const TextFormInput = ({
  name,
  label,
  placeholder,
  required,
  numberOfLines,
  keyboardType = "default",
}: Props) => {
  const { field, fieldState } = useController({
    name,
    defaultValue: "",
  });
  const { error } = fieldState;

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
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        className="bg-slate-50 border border-slate-300 text-gray-900 text-sm rounded-lg focus:ring-primary-accent
        focus:border-primary-accent w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        onBlur={field.onBlur}
        value={field.value.toString()} // we can receive numerical values
        onChangeText={field.onChange}
        ref={field.ref}
        multiline={Boolean(numberOfLines && numberOfLines > 1)}
      />
      {error && (
        <Text className="text-sm text-red-700">{error.message}</Text>
      )}
    </View>
  );
};

export default TextFormInput;
