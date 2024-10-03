import { Stack } from "expo-router";

export default function LoginLayout() {
    return(
        <Stack screenOptions={
            {
                headerShown: false
            }
        }>
            <Stack.Screen name="login" options={{headerShown:false}}/>
            <Stack.Screen name="register" options={{headerShown: false}}/>
        </Stack>
    )
}