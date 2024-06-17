import Button from "@components/Button";
import { logIn } from "@lib/Api";
import { useState } from "react";
import { StyleSheet, View, SafeAreaView, TextInput, } from "react-native";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.page}>
            <View>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttons}>
                <Button title="Log In" color="blue" onPress={async () => {
                    var { token } = await logIn('johndoe', 'password') as any
                    console.log('token: ' + token)
                }} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'normal',
        fontSize: 45,
    },
    buttons: {
        flexDirection: 'row',
        width: '80%',
        gap: 4
    }
})