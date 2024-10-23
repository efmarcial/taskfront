import {View, Text} from 'react-native';
import { useSession } from '../context/auth';


export default function SettingsScreen() {

    const {signOut, session} = useSession();

    return (
        <View>
            <Text>Settings</Text>
            <Text 
        onPress={()=> {
          // The 'app/(app)/_layout.tsx will redireact to the sign-in screen
          signOut();
        }}
      >Sign-Out</Text>
        </View>
    )
}