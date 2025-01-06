import { StyleSheet, Text, TouchableOpacity, View, Button, TextInput, ImageBackground, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

//import getAuth
import { getAuth, signInAnonymously } from "firebase/auth";
import { useState } from 'react';



const Start = ({ navigation }) => {
    const [name, setName] = useState('');

    // Choice and set background colour
    const [backgroundColor, setBackgroundColor] = useState('');
    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];



    // funtion to signInUser
    const auth = getAuth();
    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", {
                    userID: result.user.uid, name: name,
                    backgroundColor: backgroundColor
                });
                Alert.alert("Signed in Successfully!");
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, try later again.");
            })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>

                    <ImageBackground source={require("../assets/Background.png")} resizeMode="cover" style={styles.imageBackground}>

                        <View style={styles.box1}>
                            <Text style={styles.appTitle}>Chat App</Text>
                        </View>

                        <View style={styles.box2}>
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder='Your Name'
                            />

                            {/* Color Option */}
                            <Text style={styles.colorText}>Choose Background Color:</Text>
                            <View style={styles.colorContainer}>
                                {colors.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            backgroundColor === color && styles.selectedColor,
                                        ]}
                                        onPress={() => setBackgroundColor(color)}
                                    />
                                ))}
                            </View>


                            <Button style={styles.startChatButton} color="#757083"
                                title="Start Chatting"
                                onPress={signInUser}
                            />


                        </View>
                    </ImageBackground>

                </View >
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    box1: {
        flex: 3,
        padding: 20,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box2: {
        flex: 2,
        padding: 20,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        width: "88%",
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#757083",
        marginBottom: 20,
        fontSize: 16,
        fontWeight: "300",
        color: "#171717",
        opacity: 0.5,
    },
    appTitle: {
        fontSize: 45,
        fontWeight: 600,
        color: '#FFFFFF',

    },
    startChatButton: {
        fontSize: 16,
        fontWeight: 600,
        color: '#f194ff'
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    }, ginBottom: 10,

    colorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 20,
    },
    colorText: {
        fontSize: 16,
        fontWeight: "300",
        color: "#171717",
        marginBottom: 10,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: "#757083",
    },

});

export default Start;
