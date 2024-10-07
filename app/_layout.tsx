import { Slot } from "expo-router";
import { SessionProvider } from "./context/auth";


export default function RootLayout(){
  // Set up the auth context and render out layout inside of it

  console.log("RootLayout is rendereed");

  return (
    <SessionProvider>
      <Slot/>
    </SessionProvider>
  )
}