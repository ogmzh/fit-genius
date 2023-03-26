import { Asterisk } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import React from "react";
import {
  FieldValues,
  Path,
  PathValue,
  useController,
} from "react-hook-form";
import { KeyboardTypeOptions } from "react-native";
import { Input, Paragraph, XStack, YStack, useTheme } from "tamagui";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  numberOfLines?: number;
  disabled?: boolean;
  dateFormatter?: string;
};

const TextFormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  numberOfLines,
  dateFormatter,
  disabled,
  keyboardType = "default",
}: Props<T>) => {
  const { field, fieldState } = useController<T>({
    name,
    defaultValue: "" as PathValue<T, Path<T>>,
  });
  const { error } = fieldState;
  const { error: errorColor } = useTheme();

  return (
    <YStack>
      <XStack gap="$1" ai="center">
        {label && <Paragraph>{label}</Paragraph>}
        {required && (
          <Asterisk
            style={{ marginBottom: 6 }}
            size={12}
            color={errorColor.val}
          />
        )}
      </XStack>
      <Input
        editable={!disabled}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        onBlur={field.onBlur}
        value={
          dateFormatter
            ? format(field.value, dateFormatter)
            : field.value.toString()
        } // we can receive numerical values
        onChangeText={field.onChange}
        ref={field.ref}
        multiline={Boolean(numberOfLines && numberOfLines > 1)}
      />
      {error && <Paragraph color="$error">{error.message}</Paragraph>}
    </YStack>
  );
};

export default TextFormInput;
