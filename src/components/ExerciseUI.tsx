import { Button, Progress, Text, View } from "tamagui";
import { OptionCard } from "./OptionCard";
import { VocabularyExercise } from "../models/VocabularyExercise";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { randomIndex, shuffleArray } from "../utils/helpers";
import { VocabularyExerciseType } from "../utils/enums";
import { Link } from "expo-router";
import { GrammarExercise } from "../models/GrammarExercise";

export const VocabularyExerciseUI = ({
  exercise_type,
  exercise,
}: {
  exercise_type: number;
  exercise: VocabularyExercise | null;
}) => {
  const [itemIndex, setItemIndex] = useState(0); // Current exercise item number
  const [arrangement, setArrangement] = useState<Array<number>>([]);
  const [score, setScore] = useState(0);
  const [buttonText, setButtonText] = useState("Submit");
  const [correct, setCorrect] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [randomArray, setRandomArray] = useState<Array<number>>([0, 1, 2, 3]);
  const [reveal, setReveal] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [rendered, setRendered] = useState<boolean>(false); // Checks if page has been rendered

  useEffect(() => {
    let arrangement_temp = null;
    if (!rendered) {
      try {
        console.log(exercise);
        if (exercise) {
          setItemIndex(0);
          setScore(0);
          arrangement_temp = shuffleArray(
            Array.from(Array(exercise.item_sets?.length).keys())
          );
          setArrangement(arrangement_temp);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        console.log("Initialization Complete.");
        setRendered(true);
      }
    }
    // console.log("Previous correct: " + correct);
    const current = randomIndex(4);
    console.log("Current correct: " + current);
    setCorrect(current);
    if (exercise?.item_sets?.length) {
      const allIndices = Array.from(Array(exercise.item_sets.length).keys()); // Generates an array of numbers from 0 to size -1
      const filteredIndices = allIndices.filter(
        // Filters the array of numbers that does not include the current item number
        (index) =>
          arrangement_temp == null
            ? index != arrangement[itemIndex]
            : index != arrangement_temp[itemIndex]
      );
      // console.log(
      //   "~*~*~*~*~*~*~*~*~* " + test + " ~*~*~*~*~*~*~*~*~*"
      // );
      const shuffledIndices = shuffleArray(filteredIndices); // Shuffles the filtered array and selects the first four elements
      const newRandomArray = shuffledIndices.slice(0, 4);
      setRandomArray(newRandomArray);
    }
  }, [itemIndex]);

  const handleSubmit = () => {
    if (reveal) {
      console.log("Score: " + score + "/" + exercise?.item_sets?.length);
      setButtonText("Submit");
      setSelectedIndex(-1);
      if (exercise?.item_sets && itemIndex < exercise?.item_sets?.length - 1) {
        // If not last item, proceed to next item
        setItemIndex(itemIndex + 1);
      } else {
        // Else proceed to results
        setFinished(true);
      }
    } else {
      setButtonText("Next");
      if (selectedIndex == correct) setScore(score + 1);
    }
    setReveal(!reveal);
  };

  const getText = (index: number) =>
    exercise?.item_sets
      ? [
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].ceb_word,
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].ceb_word,
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].eng_word,
          "",
        ][exercise_type]
      : "...";

  const getRepresentation = (index: number) =>
    exercise?.item_sets
      ? [
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].representation,
          "",
          "",
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].representation,
        ][exercise_type]
      : "⛔";

  const optionCards = [0, 1, 2, 3].map((index) => (
    <OptionCard
      key={index}
      index={index}
      text={getText(index)}
      representation={getRepresentation(index)}
      setSelected={setSelectedIndex}
      selected={selectedIndex === index}
      correct={reveal && correct === index}
      incorrect={reveal && correct !== index && selectedIndex === index}
      disabled={reveal}
    />
  ));

  if (finished) {
    // Show results if finished
    return (
      <>
        <View
          alignSelf="center"
          jc="flex-start"
          ai="flex-start"
          p="$5"
          my="$5"
          gap="$2"
          borderColor={"$color5"}
          borderRadius="$5"
          borderWidth="$1"
          width="90%"
        >
          <Text fontSize={20}>
            {"Score: " + score + "/" + exercise?.item_sets?.length}
          </Text>
        </View>
        <Link href="/exercises/vocabulary" asChild>
          <Button alignSelf="center" width="90%" size="$6">
            Return
          </Button>
        </Link>
      </>
    );
  } else {
    // Show problems if not yet finished
    if (exercise_type < 4) {
      return (
        <>
          <Progress
            size="$2"
            value={((itemIndex + 1) / arrangement.length) * 100}
            m="$5"
            width="90%"
            alignSelf="center"
          >
            <Progress.Indicator animation="bouncy" />
          </Progress>
          <View
            alignSelf="center"
            jc="flex-start"
            ai="flex-start"
            p="$5"
            gap="$2"
            borderColor={"$color5"}
            borderRadius="$5"
            borderWidth="$1"
            width="90%"
          >
            <Text fontSize={20}>
              {itemIndex + 1 + ") "}
              {
                [
                  "Choose the correct translation for",
                  "Choose the correct translation for",
                  "Choose the English equivalent of",
                  "Choose the most suitable representation for",
                ][exercise_type]
              }
              <Text fontSize={20} fontWeight={600} color={"$color"}>
                &nbsp;"
                {!(
                  exercise?.item_sets &&
                  arrangement.length === exercise?.item_sets.length
                ) ||
                  [
                    exercise?.item_sets[arrangement[itemIndex]].eng_word,
                    exercise?.item_sets[arrangement[itemIndex]].eng_word,
                    exercise?.item_sets[arrangement[itemIndex]].ceb_word,
                    exercise?.item_sets[arrangement[itemIndex]].ceb_word,
                  ][exercise_type]}
                "
              </Text>
              .
            </Text>
          </View>
          <View
            paddingVertical="$5"
            width="100%"
            flexDirection="row"
            flexWrap="wrap"
            jc="space-evenly"
            ai="center"
            rowGap="$5"
          >
            {optionCards}
          </View>
          <Button
            alignSelf="center"
            width="90%"
            size="$6"
            onPress={handleSubmit}
            disabled={!reveal && selectedIndex === -1}
          >
            {buttonText}
          </Button>
        </>
      );
    }
  }
};

// Not yet implemented
export const GrammarExerciseUI = ({
  exercise_type,
  exercise,
}: {
  exercise_type: number;
  exercise: GrammarExercise | null;
}) => {
  const [itemIndex, setItemIndex] = useState(0); // Current exercise item number
  const [arrangement, setArrangement] = useState<Array<number>>([]);
  const [score, setScore] = useState(0);
  const [buttonText, setButtonText] = useState("Submit");
  const [correct, setCorrect] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [randomArray, setRandomArray] = useState<Array<number>>([0, 1, 2, 3]);
  const [reveal, setReveal] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [rendered, setRendered] = useState<boolean>(false); // Checks if page has been rendered

  useEffect(() => {
    let arrangement_temp = null;
    if (!rendered) {
      try {
        console.log(exercise);
        if (exercise) {
          setItemIndex(0);
          setScore(0);
          arrangement_temp = shuffleArray(
            Array.from(Array(exercise.item_sets?.length).keys())
          );
          setArrangement(arrangement_temp);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        console.log("Initialization Complete.");
        setRendered(true);
      }
    }
    const current = randomIndex(4);
    console.log("Current correct: " + current);
    setCorrect(current);
    if (exercise?.item_sets?.length) {
      const allIndices = Array.from(Array(exercise.item_sets.length).keys()); // Generates an array of numbers from 0 to size - 1
      const filteredIndices = allIndices.filter(
        // Filters the array of numbers that does not include the current item number
        (index) =>
          arrangement_temp == null
            ? index != arrangement[itemIndex]
            : index != arrangement_temp[itemIndex]
      );
      // console.log(
      //   "~*~*~*~*~*~*~*~*~* " + test + " ~*~*~*~*~*~*~*~*~*"
      // );
      const shuffledIndices = shuffleArray(filteredIndices); // Shuffles the filtered array and selects the first four elements
      const newRandomArray = shuffledIndices.slice(0, 4);
      setRandomArray(newRandomArray);
    }
  }, [itemIndex]);

  const handleSubmit = () => {
    if (reveal) {
      console.log("Score: " + score + "/" + exercise?.item_sets?.length);
      setButtonText("Submit");
      setSelectedIndex(-1);
      if (exercise?.item_sets && itemIndex < exercise?.item_sets?.length - 1) {
        // If not last item, proceed to next item
        setItemIndex(itemIndex + 1);
      } else {
        // Else proceed to results
        setFinished(true);
      }
    } else {
      setButtonText("Next");
      if (selectedIndex == correct) setScore(score + 1);
    }
    setReveal(!reveal);
  };

  const getText = (index: number) =>
    exercise?.item_sets
      ? [
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].sentence,
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].sentence,
          exercise?.item_sets[
            correct === index ? arrangement[itemIndex] : randomArray[index]
          ].translated_sentence,
          "",
        ][exercise_type]
      : "...";

  const getRepresentation = (index: number) =>
    exercise?.item_sets ? ["", "", "", ""][exercise_type] : "⛔";

  const optionCards = [0, 1, 2, 3].map((index) => (
    <OptionCard
      key={index}
      index={index}
      text={getText(index)}
      representation={getRepresentation(index)}
      setSelected={setSelectedIndex}
      selected={selectedIndex === index}
      correct={reveal && correct === index}
      incorrect={reveal && correct !== index && selectedIndex === index}
      disabled={reveal}
      lengthy
    />
  ));

  if (finished) {
    // Show results if finished
    return (
      <>
        <View
          alignSelf="center"
          jc="flex-start"
          ai="flex-start"
          p="$5"
          my="$5"
          gap="$2"
          borderColor={"$color5"}
          borderRadius="$5"
          borderWidth="$1"
          width="90%"
        >
          <Text fontSize={20}>
            {"Score: " + score + "/" + exercise?.item_sets?.length}
          </Text>
        </View>
        <Link href="/exercises/vocabulary" asChild>
          <Button alignSelf="center" width="90%" size="$6">
            Return
          </Button>
        </Link>
      </>
    );
  } else {
    // Show problems if not yet finished
    if (exercise_type < 4) {
      return (
        <>
          <Progress
            size="$2"
            value={((itemIndex + 1) / arrangement.length) * 100}
            m="$5"
            width="90%"
            alignSelf="center"
          >
            <Progress.Indicator animation="bouncy" />
          </Progress>
          <View
            alignSelf="center"
            jc="flex-start"
            ai="flex-start"
            p="$5"
            gap="$2"
            borderColor={"$color5"}
            borderRadius="$5"
            borderWidth="$1"
            width="90%"
          >
            <Text fontSize={20}>
              {itemIndex + 1 + ") "}
              {
                [
                  "Choose the correct translation for",
                  "Choose the correct translation for",
                  "Choose the English equivalent of",
                  "Choose the most suitable representation for",
                ][exercise_type]
              }
              <Text fontSize={20} fontWeight={600} color={"$color"}>
                &nbsp;"
                {!(
                  exercise?.item_sets &&
                  arrangement.length === exercise?.item_sets.length
                ) ||
                  [
                    exercise?.item_sets[arrangement[itemIndex]]
                      .translated_sentence,
                    exercise?.item_sets[arrangement[itemIndex]]
                      .translated_sentence,
                    exercise?.item_sets[arrangement[itemIndex]].sentence,
                    exercise?.item_sets[arrangement[itemIndex]].sentence,
                  ][exercise_type]}
                "
              </Text>
            </Text>
          </View>
          <View
            paddingVertical="$5"
            width="100%"
            flexDirection="row"
            flexWrap="wrap"
            jc="space-evenly"
            ai="center"
            rowGap="$2"
          >
            {optionCards}
          </View>
          <Button
            alignSelf="center"
            width="90%"
            size="$6"
            onPress={handleSubmit}
            disabled={!reveal && selectedIndex === -1}
          >
            {buttonText}
          </Button>
        </>
      );
    }
  }
};
