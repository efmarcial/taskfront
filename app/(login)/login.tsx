import React, {useState, Component} from 'react'
import {View, TextField,Text, Button} from 'react-native-ui-lib';
import { Alert, StyleSheet, TextInput , TouchableOpacity} from 'react-native';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = 'https://cqvhxh6j-8000.use2.devtunnels.ms'

const LoginScreen: React.FC = () => {

    const insets = useSafeAreaInsets();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    // Onfocus check
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isGoogleIconPressed, setIsGoogleIconPressed] = useState(false);
    const [isGithubIconPressed, setIsGithubIconPressed] = useState(false);
    const [isAppleIconPressed, setIsAppleIconPressed] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/login/`, {
                username,
                password
            });
            console.log(response.data);
            await SecureStore.setItemAsync('token', response.data.token); // Save the token securely
            Alert.alert('Login Successful', 'You have logged in successfully.');
            // Navigate to the home screen or other proteced route
        } catch (error){
            console.log(error)
            Alert.alert('Login Failed', 'An error occurred');
        }
    };

    return (
        <View flex paddingH-25 paddingT-150>
            <View>
                <Text text20BL>Login</Text>
                <Text text65L>Please sign in to continue</Text>
            </View>
            <View marginT-30 style={styles.inputContainer}>
                <Icon name='person' size={20} color={isUsernameFocused ? "#4f4f4f" :"#ccc"} style={styles.icon}/>
                <TextInput style={styles.textInput}
                    placeholder='Username'
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={'#ccc'}
                    onFocus={() => setIsUsernameFocused(true)} // On focus
                    onBlur={()=> setIsUsernameFocused(false)} // On blur
                />
            </View>
            
            <View style={styles.inputContainer}>
            <Icon name='lock-closed' size={20} color={isPasswordFocused ? "#4f4f4f" : "#ccc"} style={styles.icon} />
                <TextInput style={styles.textInput}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={'#ccc'}
                    onFocus={()=>setIsPasswordFocused(true)}
                    onBlur={()=>setIsPasswordFocused(false)}
                />
            </View>
            
            <View marginT-20 >
                <Button backgroundColor="#32db92" text65L white label='Login' onPress={handleLogin}/>
            </View>

            {/* Divider Line */}
            <View marginT-20 style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine}/>
            </View>

            {/* Social Icons*/ }
            <View style={styles.socialIconContainer}>
                <TouchableOpacity
                    onPress={()=> Alert.alert("Pressed")}
                    onPressIn={() => setIsGoogleIconPressed(true)} // When pressed down
                    onPressOut={()=> setIsGoogleIconPressed(false)} // When released
                    activeOpacity={1} // Disable gray box
                >
                    <Icon name='logo-google' size={40} color={isGoogleIconPressed ? 'darkgrey' : 'grey'} style={styles.socialIcon}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> Alert.alert("Pressed")}
                    onPressIn={() => setIsGithubIconPressed(true)} // When pressed down
                    onPressOut={()=> setIsGithubIconPressed(false)} // When released
                    activeOpacity={1} // Disable gray box
                >
                    <Icon name='logo-github' size={40} color="#3b5998" style={styles.socialIcon}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> Alert.alert("Pressed")}
                    onPressIn={() => setIsAppleIconPressed(true)} // When pressed down
                    onPressOut={()=> setIsAppleIconPressed(false)} // When released
                    activeOpacity={1} // Disable gray box
                >
                    <Icon name='logo-apple' size={40} color="black" style={styles.socialIcon}/>
                </TouchableOpacity>
            
            
            </View>

            {/* Bottom Sign-up Link*/}

            <View style={styles.socialIconContainer} marginT-20 center>
                <Text text75>Don't have an account? </Text>
                <Link style={styles.linkStyle} href="/register" >Sign-up</Link>
            </View>
            
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20, // Space between inputs
        //Box shadow for IOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        // Box shadow for Android
        elevation: 5, 
        backgroundColor: '#fff', // Required for shadow to be visible on Android
    },
    inputContainerFocused: {
        borderColor: '#4f4f4f',
        // Box shadow for IOS on focused
        shadowColor: "#4f4f4f",
        shadowOffset: {width: 5, height: 10},
        shadowOpacity: 0.8,
        shadowRadius: 8,
        // Box shadow for Android on Focused
        elevation: 10,
        backgroundColor: "#4f4f4f"
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        flex:1, 
        fontSize: 16,
        height: 40,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Space between divider and social icons
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#888',
        fontSize: 14,
    },
    socialIconContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    socialIcon: {
        marginHorizontal: 20
    },
    signupContainer: {
        flexDirection: 'row'
    },
    linkStyle: {
        fontWeight: '800',
        color: '#32db92'
    }

})

export default LoginScreen;