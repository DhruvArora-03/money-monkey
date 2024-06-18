import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { logIn } from "@lib/Api";
import { useForm } from "react-hook-form";
import { StyleSheet, View, SafeAreaView } from "react-native";

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        progressive: true,
        mode: 'onTouched'
    })

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.inputs}>
                <TextInput
                    control={control}
                    placeholder="Username"
                    name="username"
                />

                <TextInput
                    control={control}
                    placeholder="Password"
                    name="password"
                    secureTextEntry
                />
            </View>
            <View style={styles.buttons}>
                <Button title="Log In" color="blue" onPress={handleSubmit((form) =>
                    logIn(form.username, form.password).then((response) => console.log(response.token)).catch(console.log)
                )} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    title: {
        fontWeight: 'normal',
        fontSize: 45,
    },
    inputs: {
        width: '70%',
        gap: 4,
    },
    buttons: {
        flexDirection: 'row',
        width: '70%',
        gap: 4
    }
})