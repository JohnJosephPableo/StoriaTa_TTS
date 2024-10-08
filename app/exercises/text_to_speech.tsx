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
import { Audio } from 'expo-av';
import { supabase } from "../../src/utils/supabase";


export default function TextToSpeech({ session }: { session: Session }) {
  // DO NOT DELETE: FOR TESTING AND INITIALIZATION
  useEffect(() => {
    console.log("TEXT_TO_SPEECH page loaded.");
  }, []);

  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(""); 
  const [audioUrl, setAudioUrl] = useState("");

  const handleTextChange = (value: string) => {
    setText(value); 
  };

  const handleSubmit = async () => {
    const fileName = text.trim().replace(/ /g, '_');
   
    console.log(fileName)
    const {data} = await supabase
     .storage
     .from('text-to-speech')
     .getPublicUrl(fileName);

    if(data.publicUrl){
      console.log("File Exist");
      console.log(data.publicUrl)
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.publicUrl},
          { shouldPlay: true }
        );
        
        console.log('Audio is playing');
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }else{
      console.log("Generating Speech")
      const response = await fetch('https://storiatatts.agreeableground-aec2017e.australiaeast.azurecontainerapps.io/generate-audio', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      })
    const json = await response.json();
    console.log(json)

    setAudioUrl(json);
    console.log("Now getting the audio link")
    // json 
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: json },
        { shouldPlay: true }
      );
      
      // Optional: You can add more controls here
      console.log('Audio is playing');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
    }
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
