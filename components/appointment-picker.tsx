import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useState } from "react";
import { Paragraph, Stack, XStack, YStack } from "tamagui";
import { HUMAN_DATE_FORMAT } from "../shared/utils";

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
  timeFrom?: Date | null;
  onTimeFromChange: (timeFrom: Date) => void;
  timeTo?: Date | null;
  onTimeToChange: (timeTo: Date) => void;
  disabled?: boolean;
  size?: "small" | "large";
};

export const AppointmentPicker = ({
  date,
  onDateChange,
  onTimeFromChange,
  onTimeToChange,
  timeFrom,
  timeTo,
  disabled,
  size = "large",
}: Props) => {
  const [timeFor, setTimeFor] = useState<"date" | "from" | "to" | null>(
    null
  );

  const onTimeChange = (
    event: DateTimePickerEvent,
    value: Date | undefined
  ) => {
    setTimeFor(null); // must set this first before updating date state

    if (event.type === "set" && value) {
      switch (timeFor) {
        case "from": {
          onTimeFromChange(value);
          break;
        }
        case "to": {
          if (timeFrom && value > timeFrom) {
            onTimeToChange(value);
          } else {
            alert("Must be after time From");
          }
          break;
        }
        case "date": {
          onDateChange(value);
          break;
        }
        // No default
      }
    }
  };

  const pickerValue = () => {
    if (timeFor === "from" && timeFrom) {
      return timeFrom;
    } else if (timeFor === "to" && timeTo) {
      return timeTo;
    }
    return new Date();
  };

  return (
    <>
      <YStack>
        <Paragraph
          size={size === "large" ? "$8" : "$5"}
          fow="bold"
          bg="$backgroundSoft"
          px="$4"
          py="$2"
          br="$2"
          mb="$2"
          alignSelf="center"
          disabled={disabled}
          onPress={() => setTimeFor("date")}>
          {format(date, HUMAN_DATE_FORMAT)}
        </Paragraph>
        <XStack p="$2" mb="$4" alignSelf="stretch" jc="space-around">
          <YStack
            br="$4"
            bw="$1.5"
            boc="$accent"
            p="$3"
            bg="$backgroundSoft"
            disabled={disabled}
            onPress={() => setTimeFor("from")}>
            <Paragraph size={size === "large" ? "$8" : "$5"}>
              From
            </Paragraph>
            <Stack>
              <Paragraph size={size === "large" ? "$10" : "$6"}>
                {timeFrom && format(timeFrom, "HH:mm")}
              </Paragraph>
            </Stack>
          </YStack>
          <YStack
            br="$4"
            bw="$1.5"
            boc="$accent"
            p="$3"
            bg="$backgroundSoft"
            disabled={disabled}
            onPress={() => setTimeFor("to")}>
            <Paragraph size={size === "large" ? "$8" : "$5"}>To</Paragraph>
            <Stack>
              <Paragraph size={size === "large" ? "$10" : "$6"}>
                {timeTo && format(timeTo, "HH:mm")}
              </Paragraph>
            </Stack>
          </YStack>
        </XStack>
      </YStack>
      {timeFor && (
        <RNDateTimePicker
          value={pickerValue()}
          mode={timeFor === "date" ? "date" : "time"}
          is24Hour
          onChange={(event, value) => onTimeChange(event, value)}
        />
      )}
    </>
  );
};
