import React, {useState, Component, useEffect} from 'react'
import {View, TextField,Text, Button} from 'react-native-ui-lib';
import { Alert, StyleSheet, TextInput , TouchableOpacity} from 'react-native';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Icon from 'react-native-vector-icons/Ionicons';
import { Link, router } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import { Router } from 'expo-router';
import { useSession } from './context/auth';
import { useStorageState } from './context/useStorageState';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const API_URL = 'https://cqvhxh6j-8000.use2.devtunnels.ms'
const GITHUB_CLIENT_ID = "Ov23liGyjyOumPOAiD6F";
const GITHUB_CLIENT_SECRECT = "ee085cab2394f0316437d43dd2fb329badfc82a2";

const github_discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
  };

const LoginScreen: React.FC = () => {

    const {signIn} = useSession();
    const [[isLoading, session], setSession] = useStorageState('session');


    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    // Onfocus check
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isGoogleIconPressed, setIsGoogleIconPressed] = useState(false);
    const [isGithubIconPressed, setIsGithubIconPressed] = useState(false);
    const [isAppleIconPressed, setIsAppleIconPressed] = useState(false);

    const [request, response, githubPromptAsync] = useAuthRequest(
        {
            clientId: GITHUB_CLIENT_ID,
            scopes: ['identity'],
            redirectUri: makeRedirectUri(),
        },
        github_discovery
    );

    useEffect(() => {
        if(response?.type === 'success'){
            const {code} = response.params;
        }
    }, [response]);



    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill in both field");
            return;
        }
        try{
            await signIn(username, password);// pass the inputs to the signin function
            router.replace("/"); // Navigate after successful login

        }catch(error){
            console.error('Sign-in Error', error);
            Alert.alert('Sign-In Failed', "Please check your credentials");
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
                    onPress={()=> {Alert.alert("You have Pressed me");}}
                    onPressIn={() => setIsGoogleIconPressed(true)} // When pressed down
                    onPressOut={()=> setIsGoogleIconPressed(false)} // When released
                    activeOpacity={1} // Disable gray box
                >
                    <Icon name='logo-google' size={40} color={isGoogleIconPressed ? 'darkgrey' : 'grey'} style={styles.socialIcon}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> githubPromptAsync()}
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