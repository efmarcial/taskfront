import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import 'react-native-gesture-handler';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/login">View Login</Link>
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