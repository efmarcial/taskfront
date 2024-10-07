import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

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
  const [[isLoading, session], setSession] = useStorageState('session');
  const BASE_API = "https://cqvhxh6j-8000.use2.devtunnels.ms"

  console.log('Initial session state: ', session);



  const signIn = async (username: string, password: string) => {
    try {

        console.log('signIn function called');
        console.log(`Current session: ${session}`);

        if (session){
            // Validate token by making an API Request
            console.log("Checking token: ")
            console.log(`token: ${session}`)
            const response = await axios.get(`${BASE_API}/token/`, {
                headers: {Authorization: `Bearer ${session}`}
            } );

            if(response.status === 200){
                // Token is valid, set session
                console.log("token success")
                setSession(response.data.tokens.access);
            }else{
                //No token found, fallback to login API
                console.log("Token is invalid, logging in again.")
                setSession(null);
                await performLogin(username, password);
            }
        } else{
            // No token found, fallback to login API
            console.log('No token has been founed...............')
            setSession(null);
            await performLogin(username, password);
        }
    } catch(error){
      setSession(null);
        console.error('Error during signIn()', error);
        Alert.alert("Login Error", "An error occurreed during sign-in")
    }
  };

  const performLogin = async (username:string, password: string) => {


    // Call your login API
    try {
      console.log("Performing login........")
        const response = await axios.post(`${BASE_API}/login/`, {
            username,
            password
        });
        console.log("Logging in....", response.data)
        await SecureStore.setItemAsync('refresh_token', response.data.tokens.refresh);
        setSession(response.data.tokens.access); // Set session with new token
        // Navigate to the home screen or other proteced route
    } catch (error){
        console.log(error)
        setSession(null);
        Alert.alert('Login Failed', 'An error occurred');
    }

  }
  const signOut = async () => {

    try{

        if(session) {
            // Get refresh token
            const refresh_token = await SecureStore.getItemAsync('refresh_token');

            // validate token by making an API Request
            // Check if token exist in session
            console.log(session);
            const response = await axios.post(`${BASE_API}/logout/`, {}, {
                headers : {Authorization: `Bearer ${refresh_token}`}
            })

            console.log("Logging out......")
            console.log(response.data);
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
