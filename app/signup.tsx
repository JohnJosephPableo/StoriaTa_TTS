import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  SizableText,
  TamaguiProvider,
  Text,
  XStack,
  View,
  Image
} from "tamagui";
import { UserAuthentication} from "../src/services/UserAuthentication";
import { Check } from "@tamagui/lucide-icons";
import config from "../tamagui.config";
import { Link, router } from "expo-router";
import { Session, User } from "@supabase/supabase-js";
import logo from '../src/assets/logo.svg';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isContributor, setIsContributor] = useState(false);
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session>();

  // DO NOT DELETE: FOR TESTING AND INITIALIZATION
  useEffect(() => {
    console.log("SIGNUP page loaded.");
  }, []);

  const signup = async () => {
    setLoading(true);
    const result = UserAuthentication.checkPassword(password, confirmPassword)
    result ? "" : alert("Password not correct");
    const data: any = await UserAuthentication.signUpWithEmail(email, password);
    if (data?.user?.id && isContributor) {
      UserAuthentication.requestContributor(data.user.id);
    }
    setLoading(false);
    router.push("/login");
  };

  const handleContributorChange = () => {
    setIsContributor(!isContributor);
  };

  return (
    <TamaguiProvider config={config}>
      <View flex={1} padding="$4" marginTop="$10">
        <View justifyContent="center" alignItems="center">
          <Image source={logo} width="$15" height="$15" />
        </View>
      <View justifyContent="center" alignContent="center">
        <SizableText fontFamily="$body" color="black">
          {" "}
          Email{" "}
        </SizableText>
        <Input
          size="$4"
          placeholder="email@gmail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        </View>
        <View marginTop={10}>
          <SizableText fontFamily="$body" color="black">
            {" "}
            Password{" "}
          </SizableText>
          <Input
            size="$4"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View marginTop={10}>
          <SizableText fontFamily="$body" color="black">
            {" "}
            Confirm Password{" "}
          </SizableText>
          <Input
            size="$4"
            placeholder="ConfirmPassword"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <View marginTop="$5"
          flexDirection="row"
          justifyContent="center"
          alignItems="center">
          <XStack width={300} alignItems="center" justifyContent="center" gap={20}>
            <Checkbox
              size="$5"
              checked={isContributor}
              onPress={() => handleContributorChange()}>
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
            <Text color="black" fontFamily={"$body"}>Register as a Contributor?</Text>
          </XStack>
        </View>
        <View marginTop={15}>
          <Button size="$4" disabled={loading} onPress={signup}>
            Sign up
          </Button>
        </View>
        <View marginTop={20} flexDirection="row" alignItems="center" justifyContent="center">
          <Text color="$background" fontFamily={"$body"}>
            Already have an account? {" "}
          </Text>
          <Link href="/">
            <Text color="$background" fontFamily={"$body"} fontSize={16} fontWeight="bold">
              Sign In
            </Text>
          </Link>
        </View>
      </View>
    </TamaguiProvider>
  );
}


