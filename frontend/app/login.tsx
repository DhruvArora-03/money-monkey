import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { logIn } from "@lib/Api";
import { useForm } from "react-hook-form";
import { StyleSheet, View, SafeAreaView } from "react-native"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
}).required()

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        progressive: true, // dont know what this does
        mode: 'all',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        resolver: yupResolver(schema)
    })

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.inputs}>
                <TextInput
                    control={control}
                    placeholder="Username"
                    name="username"
                    error={errors.username}
                />
                <TextInput
                    control={control}
                    placeholder="Password"
                    name="password"
                    secureTextEntry
                    error={errors.password}
                />
            </View>
            <View style={styles.buttons}>
                <Button title="Log In" color="blue" onPress={handleSubmit((form) =>
                    logIn(form.username, form.password)
                        .then((response) => SecureStore.setItemAsync('auth', response.token))
                        .then(() => router.replace('/home'))
                        .catch(console.log)
                )} />
                <Button title="temp" color="green" onPress={() => SecureStore.getItemAsync('auth').then(console.log)} />
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