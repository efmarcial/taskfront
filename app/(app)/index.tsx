import { Text, View, StyleSheet } from "react-native";
import { useSession } from "../context/auth";


export default function Index() {
  const {signOut} = useSession();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Text 
        onPress={()=> {
          // The 'app/(app)/_layout.tsx will redireact to the sign-in screen
          signOut();
        }}
      >Sign-Out</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1, 
    justifyContent: 'center',
    alignItems: 'center',
  }
})