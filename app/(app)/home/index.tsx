import axios from "axios";
import { StyleSheet, FlatList, TouchableOpacity, TextInput} from "react-native";
import {View, Text} from 'react-native-ui-lib';
import { useSession } from "../../context/auth";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";

// TODO: 
// - Add a api request for the refresh token here so everytime
//  the home screen is open a new access token is requested
//  and saved into useSession session 

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
}

const BASE_API = "https://cqvhxh6j-8000.use2.devtunnels.ms";


export default function Index() {
  const {signOut, session} = useSession();
  const [search, setSearch] = useState<string>('');
  const [firstName, setFirstName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [services, setService] = useState<Service[]>([]);

  console.log(firstName);

  const [isSeacrchedFocused, setIsSeacrchFocused] = useState(false);

  const [loading, setLoading] = useState<boolean>(true); // For mananing loading state

  

  useEffect(() => {

    const getService = async () => {

      
      try{
  
        const response = await axios.get(`${BASE_API}/api/services/`);
        console.log(response.data);
        setService(response.data);
        return response.data;
      
      }catch(error){
        console.error(error);
      }finally{
        setLoading(false); // Turn of loadinf once data is fetched 
      }
    };

    const fetchUserData = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedFirstName = await SecureStore.getItemAsync('first_name');
      setFirstName(storedFirstName);
      setUsername(storedUsername);
    };

    fetchUserData();
    getService();

  }, []);

  const renderService = ({item}: {item:Service}) => (
    <TouchableOpacity style={styles.serviceBox}>
      <Text>{item.name}</Text>
      <Text>Duration: {item.duration} hrs</Text>
    </TouchableOpacity>
  )

  // Placeholder skeletons while loading
  const renderPlaceholderItem = () => {
    return (
      <View style={styles.serviceBoxPlaceholder}></View>
    ) 
  }

  const renederListHeader = () => {

    return (
      <View>
        <Text text40>Welcome {firstName ? firstName: 'Guest'}</Text>

        <TouchableOpacity
          style = {styles.searchButton}
          
        >
          <Icon  style={styles.icon} name="search" size={20} color={'white'} />
          <Text text80BL marginR-10 color={'white'}>Search Services</Text>

        </TouchableOpacity>

        <Text marginT-15 marginB-15 text60>Suggestions</Text>
    </View>
    )
    
  }


  return (
    <View flex paddingH-20 paddingT-80>
      
        
        {loading ? (
          // Display placeholder boxes while loading
          <FlatList
            data={['1', '2', '3' , '4']} // Dummy data to render placeholder text
            renderItem={renderPlaceholderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListHeaderComponent={renederListHeader} // Add the header to the list
          />
        ): (
          <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={item => item.id.toString()}
          numColumns={2} // 2 Columns for grid layout
          columnWrapperStyle={styles.row} // styling for rows
          ListHeaderComponent={renederListHeader} // Add the header to the lsit
        />
        )}
      
        

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1, 
  },
  row: {
    justifyContent: 'space-between'
  },
  serviceBox: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  // Styles for the placeholder skeleton boxes
  serviceBoxPlaceholder :  {
    flex: 1,
    backgroundColor: '#e0e0e0', // Lighter color for placeholder effect
    margin: 5,
    borderRadius: 10,
    height: 150,
  },
  icon: {
    marginRight: 10,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 15,
    height: 50
  },
})