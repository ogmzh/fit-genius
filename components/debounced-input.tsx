import { X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import {
  Input,
  InputProps,
  Stack,
  XStack,
  XStackProps,
  useDebounce,
} from "tamagui";

interface Props extends InputProps {
  value?: string;
  onValueChange: (newValue: string) => void;
  containerProps?: XStackProps;
  inputProps?: InputProps;
}

export const DebouncedInput = ({
  value = "",
  onValueChange,
  containerProps,
  inputProps,
}: Props) => {
  const [innerValue, setInnerValue] = useState(value);

  const debounceFn = useDebounce(value => onValueChange(value), 700, {
    leading: false,
  });

  useEffect(() => {
    if (debounceFn) {
      debounceFn(innerValue);
    }

    return () => debounceFn.cancel();
  }, [innerValue]);

  return (
    <XStack
      ai="center"
      borderColor="$backgroundSoftActive"
      bg="$backgroundSoft"
      borderRadius="$4"
      borderWidth="$0.5"
      pr="$2"
      {...containerProps}>
      <Input
        placeholderTextColor="$textSofter"
        bg="$backgroundSoft"
        value={innerValue}
        onChangeText={setInnerValue}
        clearButtonMode="always"
        borderWidth="$0"
        mr="$2"
        f={1}
        {...inputProps}
      />
      {innerValue && (
        <Stack p="$2" onPress={() => setInnerValue("")}>
          <X color="$error" />
        </Stack>
      )}
    </XStack>
  );
};
