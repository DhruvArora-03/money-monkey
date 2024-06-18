import Button from "@components/Button";
import { Link } from "expo-router";
import { StyleSheet, Text, View, SafeAreaView, } from "react-native";

export default function WelcomeScreen(props: any) {
    return (
        <SafeAreaView style={styles.page}>
            <View>
                <Text style={styles.title}>Welcome</Text>
            </View>
            <View style={styles.buttons}>
                <Link href='/register' asChild>
                    <Button title="Register" color="blue" />
                </Link>
                <Link href='/login' asChild>
                    <Button title="Log In" color="gray" />
                </Link>
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
        gap: 8
    }
})