import Button from "@components/Button";
import { StyleSheet, Text, View, SafeAreaView, TextInput, } from "react-native";

export default function LoginScreen(props: any) {
    return (
        <SafeAreaView style={styles.page}>
            <View>
                <TextInput></TextInput>
            </View>
            <View style={styles.buttons}>
                <Button title="Log In" color="blue" onPress={() => {
                    props.navigation.navigate("index")
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