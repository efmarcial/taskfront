import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "../context/auth";


export default function AppLayout(){
    const {session, isLoading} = useSession();
    console.log(session);
    console.log(isLoading);

    // You can keep the splash screen open, or render a loading screen like we do here.....
    if (isLoading) {
        console.log("App layout loading.........")
        return <Text>Loading.....</Text>
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign-in again.
    if(!session){
        console.log("No session found")
       // On web, static rendering will stop here as the user is not authenticated
       // in the headless Node process that the page are rendered in.
       return <Redirect href="/login" /> 
    }

    return <Stack />
}