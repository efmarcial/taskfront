import { Stack } from "expo-router";
import React, {useState, useEffect} from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";


const API_URL = 'https://cqvhxh6j-8000.use2.devtunnels.ms/verify/' // Replace with api that uses token api

export default function RootLayout() {


  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null for loading state

  useEffect(() => {
    const CheckLoginStatus = async () => {
      try{
        const token = await SecureStore.getItemAsync('token');

        if (token){
          console.log(`Token ${token}`);
          const response = await axios.get(API_URL, {
            headers: {
              Authorization : `Token ${token}`
            }
          });

          // Assuming the response returns an "isValid" field
          console.log(response.data);
          setIsLoggedIn(response.data.isValid);
        }else{
          setIsLoggedIn(false)
        }
      } catch(error){
        console.log(error)
        setIsLoggedIn(false); // On error, assume not logged in.
      }
    };

    CheckLoginStatus();
  }, [])

  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen  name="(login)" />
    </Stack>
  );
}
