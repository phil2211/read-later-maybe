import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import styles from "../stylesheet";

export function LoginView({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, signUp, signIn } = useAuth();

    useEffect(() => {
        // If there is a user logged in, go to the Projects page.
        if (user != null) {
          navigation.navigate("Links");
        }
      }, [user]);

    const onPressSignIn = async () => {
        console.log("Trying sign in with user: " + email);
        try {
          await signIn(email, password);
        } catch (error) {
          const errorMessage = `Failed to sign in: ${error.message}`;
          console.error(errorMessage);
          Alert.alert(errorMessage);
        }
      };
    
      const onPressSignUp = async () => {
        console.log("Trying signup with user: " + email);
        try {
          await signUp(email, password);
          signIn(email, password);
        } catch (error) {
          const errorMessage = `Failed to sign up: ${error.message}`;
          console.error(errorMessage);
          Alert.alert(errorMessage);
        }
      };

    return (
        <View>
        <Text>Sign Up or Sign In:</Text>
        <View style={styles.inputContainer}>
            <TextInput 
                onChangeText={(text) => setEmail(text)}
                style={styles.inputStyle}        
                placeholder="email"
                autoCapitalize="none"
            />
        </View>
        <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    style={styles.inputStyle}
                    placeholder="password"
                    secureTextEntry
            />
        </View>
            <Button onPress={ onPressSignIn } title="Sign In" />
            <Button onPress={ onPressSignUp } title="Sign Up" />
        </View>
    );
}