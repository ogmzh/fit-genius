import { H4, Paragraph, XStack } from "tamagui";
import { useExercises } from "../queries/exercises";
import ScreenContainer from "../components/screen-container";
import { useRouter } from "expo-router";

export const ExerciseList = () => {
  const { data } = useExercises();
  const { push } = useRouter();

  return (
    <ScreenContainer>
      {data?.exercises.map(exercise => (
        <XStack
          onPress={() => push(`exercises/${exercise.id}`)}
          key={exercise.id}
          boc="$backgroundSoft"
          jc="space-between"
          ai="center"
          bg="$backgroundSoft"
          px="$4"
          py="$3"
          mb="$4"
          br="$2"
          mx="$6"
          bw="$1"
          pressStyle={{
            bg: "$backgroundSoftActive",
          }}>
          <Paragraph>{exercise.name}</Paragraph>
        </XStack>
      ))}
    </ScreenContainer>
  );
};
