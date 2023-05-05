import { Paragraph, Stack, XStack, YStack } from "tamagui";
import ScreenContainer from "../components/screen-container";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  ExerciseSchema,
  exerciseSchema,
} from "../shared/validation/exercise";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormInput from "../components/text-form-input";
import { ThumbSwitch } from "../components/thumb-switch";
import { ActionButton } from "../components/action-button";
import { useMutateExercises } from "../queries/exercises";

export const ExercisesForm = () => {
  const formMethods = useForm<ExerciseSchema>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      type: "repetition",
      tags: ["test"],
    },
    reValidateMode: "onSubmit",
  });

  const { watch, setValue, handleSubmit, formState } = formMethods;
  const { isValid } = formState;

  const { createExerciseAsync, isCreatingExercise } = useMutateExercises();

  const onSubmit: SubmitHandler<ExerciseSchema> = async data => {
    await createExerciseAsync(data);
  };

  const exerciseType = watch("type");

  return (
    <ScreenContainer>
      <FormProvider {...formMethods}>
        <YStack px="$4" f={1} justifyContent="space-between">
          <YStack gap="$3">
            <TextFormInput<ExerciseSchema>
              name="name"
              label="Name"
              placeholder="Chest supported dumbbell row"
              required
            />
            <TextFormInput<ExerciseSchema>
              name="link"
              label="Link to video"
              placeholder="https://www.youtube.com/watch?v=vmX58YYK3-8"
            />
            <TextFormInput<ExerciseSchema>
              name="description"
              label="Description"
              placeholder="Incline bench, pull with back"
              numberOfLines={4}
            />
            <XStack ai="center" jc="space-evenly">
              <YStack gap="$2" ai="center">
                <Paragraph>Repetition</Paragraph>
                <ThumbSwitch
                  value={exerciseType === "repetition"}
                  onValueChange={() =>
                    setValue(
                      "type",
                      exerciseType === "time" ? "repetition" : "time"
                    )
                  }
                />
              </YStack>
              <YStack gap="$2" ai="center">
                <Paragraph>Time duration</Paragraph>
                <ThumbSwitch
                  value={exerciseType === "time"}
                  onValueChange={() =>
                    setValue(
                      "type",
                      exerciseType === "time" ? "repetition" : "time"
                    )
                  }
                />
              </YStack>
            </XStack>
          </YStack>
          <Stack alignItems="center" mb="$4">
            <ActionButton
              label="Confirm"
              backgroundColor={
                isCreatingExercise || !isValid
                  ? "$backgroundDisabled"
                  : "$primary"
              }
              textColor={
                isCreatingExercise || !isValid ? "$textDisabled" : "$text"
              }
              pressStyleBackground="$primaryActive"
              disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
            />
          </Stack>
        </YStack>
      </FormProvider>
    </ScreenContainer>
  );
};
