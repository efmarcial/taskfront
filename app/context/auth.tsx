import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<{
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {

  // Session is where the access token is saved from the django api
  const [[isLoading, session], setSession] = useStorageState('session');
  const BASE_API = "https://cqvhxh6j-8000.use2.devtunnels.ms"

  console.log('Initial session state');



  const signIn = async (username: string, password: string) => {
    // Call your login API
    try {
      console.log("Performing login........")
        const response = await axios.post(`${BASE_API}/login/`, {
            username,
            password
        });
        console.log("Logging in....", response.data)
        
        // Save user info in SecureStore
        await SecureStore.setItemAsync('refresh_token', response.data.tokens.refresh);
        await SecureStore.setItemAsync('username', response.data.username);
        await SecureStore.setItemAsync('email', response.data.email);
        await SecureStore.setItemAsync('first_name', response.data.first_name);
        await SecureStore.setItemAsync('last_name', response.data.last_name);
        await SecureStore.setItemAsync('profile_type', response.data.profile.user_type);


        setSession(response.data.tokens.access); // Set session with new token
    } catch (error){
        console.error(error)
        setSession(null);
        Alert.alert('Login Failed', 'An error occurred');
    }
  };

  const signOut = async () => {

    try{

      
        if(session) {
            // Get refresh token
            

            // validate token by making an API Request
            // Check if token exist in session
            console.log(session);
            const response = await axios.post(`${BASE_API}/logout/`, {}, {
                headers : {Authorization: `Bearer ${session}`}
            })

            console.log("Logging out......")
            console.log(response.data);

            // Delete all user profile that has been saved in SecureStore
            await SecureStore.deleteItemAsync('username');
            await SecureStore.deleteItemAsync('email');
            await SecureStore.deleteItemAsync('refresh_token');
            await SecureStore.deleteItemAsync('first_name');
            await SecureStore.deleteItemAsync('last_name');
            await SecureStore.deleteItemAsync('profile_type');

            // Delete session by setting it to null
            setSession(null);
        } else{
            console.log("No session found, already logged out");
        }

        
    }catch(error){
        console.log(error)
        console.log("Logout Failed", error)
        Alert.alert("Logout faild", "An error occurred during logout")
        setSession(null)
    }

  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
