import {View, Text} from 'react-native';
import { useSession } from '../../context/auth';


export default function SearchScreen() {

    const {signOut, session} = useSession();

    return (
        <View>
            <Text>Seacrh</Text>
        </View>
    )
}