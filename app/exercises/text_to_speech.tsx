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
  Input,
} from "tamagui";
import { useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";


export default function TextToSpeech({ session }: { session: Session }) {
  // DO NOT DELETE: FOR TESTING AND INITIALIZATION
  useEffect(() => {
    console.log("LISTENING_EXERCISES page loaded.");
  }, []);

  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(""); 

  const handleTextChange = (value: string) => {
    setText(value); 
  };

  const handleSubmit = async () => {
    
  };

  return (
    <TamaguiProvider>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <YStack
          f={1}
          jc="center"
          ai="center"
          backgroundColor={"$background"}
        >
          <XStack jc="space-between" ai="flex-start" padding="$5">
            <Text fontSize={30} fontWeight={800} color={"$color"}>
              Text-to-Speech
            </Text>

          </XStack>

            <YGroup
                alignSelf="center"
                size="$5"
                jc="center"
>
                <Input
                size="$5"
                placeholder="Enter the text"
                width={300}
                maxWidth="100%"
                minHeight={50}
                multiline
                paddingHorizontal="$3"
                textAlign="left"
                value={text}
                onChangeText={handleTextChange}
                />
                <Button
                size="$5"
                alignSelf="center"
                marginTop="$3"
                onPress={handleSubmit}
                >
                Submit
                </Button>
            </YGroup>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
