// IMPORTS
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
// client-side storage lib
import AsyncStorage from "@react-native-async-storage/async-storage";
// CustomActions
import CustomActions from './CustomActions';
// for MapView sending geolocations
import MapView from 'react-native-maps';

// Destructure name, background and UserId from route.params
const Chat = ({ db, storage, route, navigation, isConnected }) => {

    const { userID, name, backgroundColor } = route.params;

    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        const messRefIF = addDoc(collection(db, "messages"), newMessages[0])
    }

    // function renderActions 
    const renderBubble = (props) => {

        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }
    // renderInputToolbar
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }
    //renderCustomActions
    const renderCustomActions = (props) => {
        return <CustomActions userID={userID} storage={storage} onSend={(newMessages => {
            onSend([{
                ...newMessages,
                _id: `${new Date().getTime()}-${userID}`,
                createdAt: new Date(),
                user: {
                    _id: userID,
                    name: name
                }
            }])
        })} {...props} />;
    };



    //function renderCustomView
    const renderCustomView = (props) => {

        // extract the currentMessage object from the props
        const { currentMessage } = props;

        // if currentMessage contains location data, return a MapView
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    // Note that latitudeDelta & longitudeDelta determine size of the map
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }



    // Add onSnapshot using AsyncStorage

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected === true) {

            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                })
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();


        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);



    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                user={{
                    _id: userID,
                    name
                }}
            />

            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Chat;