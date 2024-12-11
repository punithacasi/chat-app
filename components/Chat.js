import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

// Destructure name, background and UserId from route.params
const Chat = ({ db, route, navigation }) => {

    const { userID, name, backgroundColor } = route.params;
    const [messages, setMessages] = useState([]);


    // useEffect hook to set messages options
    // Create a query to get the "messages" collection from the Firestore database
    useEffect(() => {
        navigation.setOptions({ title: name });



        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                    backgroundColor: doc.backgroundColor
                })
            })
            setMessages(newMessages);
        });
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);


    const onSend = (newMessages) => {
        const messRefIF = addDoc(collection(db, "messages"), newMessages[0])
    }

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

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name, backgroundColor
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