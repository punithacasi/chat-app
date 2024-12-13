// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// import the use NetInfo
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";

// Create the navigator
const Stack = createNativeStackNavigator();

import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// import firebase/app , disableNetwork /enableNetwork
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

const App = () => {

  // connectionStatus
  const connectionStatus = useNetInfo();
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Initialize firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyB32WGcpsBCy3GxopmrxJ29ERPG0xt1FUg",
    authDomain: "chat-app-b04b6.firebaseapp.com",
    projectId: "chat-app-b04b6",
    storageBucket: "chat-app-b04b6.firebasestorage.app",
    messagingSenderId: "172233677464",
    appId: "1:172233677464:web:c5af55373a88d36ee50eed"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />}

        </Stack.Screen>



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
