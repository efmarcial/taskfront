import React, {useState} from "react";
import {View, Text, Button} from 'react-native-ui-lib';
import { Alert, StyleSheet, TextInput} from "react-native";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons'
import { Link } from "expo-router";


const RegisterScreen: React.FC = () => {
    
    const API_URL = 'https://cqvhxh6j-8000.use2.devtunnels.ms' 
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${API_URL}/register/`, {
                username,
                password,
                password2,
                email
            });
            console.log(response.data);
            await SecureStore.setItemAsync('token', response.data.token); 
            Alert.alert('Register Complete')
        }catch(error){
            console.log(error);
            Alert.alert('Register failed');
        }
    };

    return (
        <View flex paddingH-25 marginT-80>
            <View left>
                <Link href="/login">
                <Icon name="arrow-back" size={30} color='grey' />
                </Link>
            </View>
            <View  marginT-50>
                <Text text40BL>Create Account</Text>
            </View>

            <View marginT-10 style={styles.inputContainer}>
                <Icon name="person" size={20} color="grey" style={styles.inputIcon}/>
                <TextInput style={styles.textInput}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={"#ccc"}
                />
            </View>

            {/* email */}
            <View style={styles.inputContainer}>
                <Icon name="at-circle-outline" size={20} color="grey" style={styles.inputIcon}/>
                <TextInput style={styles.textInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={"#ccc"}
                    inputMode="email"
                />
            </View>

            {/* password */}
            <View style={styles.inputContainer}>
                <Icon name="lock-closed" size={20} color="grey" style={styles.inputIcon}/>
                <TextInput style={styles.textInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={"#ccc"}
                    secureTextEntry
                />
            </View>
            {/* password2 */}
            <View style={styles.inputContainer}>
                <Icon name="lock-closed" size={20} color="grey" style={styles.inputIcon}/>
                <TextInput style={styles.textInput}
                    placeholder="Confirm Password"
                    value={password2}
                    onChangeText={setPassword2}
                    placeholderTextColor={"#ccc"}
                    secureTextEntry
                />
            </View>

            <View marginT-20>
                <Button backgroundColor="#32db92" text65L white label="Sign Up" onPress={handleRegister}/>
            </View>

            <View marginT-20 center style={{
                flexDirection: 'row',
                justifyContent: 'center'                
            }}>
                <Text>Already have a account </Text>
                <Link 
                    href='/login'
                    style={{
                        fontWeight: '800',
                        color: '#32db92'
                    }}
                >
                    Sign In
                </Link>
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20, // Space between inputs
        // Box shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        // Box shadow for Android
        elevation: 5, 
        backgroundColor: '#fff'
    },
    textInput: {
        flex: 1, 
        fontSize: 16,
        height: 40,
    },
    inputIcon: {
        marginRight: 10,
    }
})

export default RegisterScreen;