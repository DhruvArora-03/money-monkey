import Button from "@components/Button";
import { logIn } from "@lib/Api";
import { StyleSheet, View, SafeAreaView, TextInput, } from "react-native";

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.page}>
            <View>
                <TextInput></TextInput>
            </View>
            <View style={styles.buttons}>
                <Button title="Log In" color="blue" onPress={() => {
                    logIn('user', 'pass')
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