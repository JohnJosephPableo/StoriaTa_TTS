import { Session } from "@supabase/supabase-js";
import {
  Button,
  H5,
  Paragraph,
  YStack,
  Accordion,
  Square,
  XStack,
  View,
  Text,
  TamaguiProvider,
  Theme,
  ScrollView,
  YGroup,
  Separator,
  ListItem,
  ButtonIcon,
  Spinner,
} from "tamagui";
import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { ExerciseService } from ".../../../src/services/ExerciseService";
import { useLocalSearchParams } from "expo-router";
import { VocabularyExercise } from "../../../src/models/VocabularyExercise";
import { VocabularyExerciseUI } from "../../../src/components/ExerciseUI";
import { VocabularyExerciseType } from "../../../src/utils/enums";

export default function VocabularyExercises({
  session,
  exercise_id,
}: {
  session: Session;
  exercise_id: number;
}) {
  // DO NOT DELETE: FOR TESTING AND INITIALIZATION
  useEffect(() => {
    console.log("VOCABULARY_EXERCISES_" + local.exercise_id + " page loaded.");
  }, []);

  const TEMP_USER_UUID = "3ad19072-1877-415d-bf5e-61c4bfe03977";
  const colorScheme = useColorScheme();
  const local = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [exercise, setExercise] = useState<VocabularyExercise | null>();
  const [vocabExerType, setVocabExerType] = useState<VocabularyExerciseType>(
    VocabularyExerciseType.ChooseCebRepresentationForEngWord
  );

  useEffect(() => {
    loadExercise();
  }, []);

  const loadExercise = async () => {
    try {
      setLoadingText("Loading exercise...");
      setLoading(true);
      let problems = await ExerciseService.getVocabularyExerciseProblems(
        parseInt(local.exercise_id as string)
      );
      let exerType: VocabularyExerciseType =
        await ExerciseService.getVocabularyExerciseType(
          parseInt(local.exercise_id as string),
          TEMP_USER_UUID
        );
      setVocabExerType(exerType);
      setExercise(problems);
      console.log("*****" + problems);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TamaguiProvider>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <YStack f={1} jc="center" ai="stretch" backgroundColor={"$background"}>
          {loading && exercise ? (
            <YStack jc="flex-start" ai="center" padding="$5">
              <Spinner size="large" color="$blue9" m="$2" />
              <Text fontSize={20} fontWeight={400} color={"$color"}>
                {loadingText}
              </Text>
            </YStack>
          ) : (
            <VocabularyExerciseUI
              exercise_id={parseInt(local.exercise_id as string)}
              exercise_type={vocabExerType as number}
              exercise={exercise || null}
            />
          )}
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
