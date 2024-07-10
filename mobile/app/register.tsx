import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { register } from "@lib/Api";
import { useForm } from "react-hook-form";
import { StyleSheet, View, SafeAreaView } from "react-native"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { router } from "expo-router";

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    confirm: yup.string().required(),
}).required()

export default function RegisterPage() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirm: ''
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
                    placeholder="First Name"
                    name="firstName"
                    error={errors.firstName}
                />
                <TextInput
                    control={control}
                    placeholder="Last Name"
                    name="lastName"
                    error={errors.lastName}
                />
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
                <TextInput
                    control={control}
                    placeholder="Confirm Password"
                    name="confirm"
                    secureTextEntry
                    error={errors.confirm}
                />
            </View>
            <View style={styles.buttons}>
                <Button title="Register" color="green" onPress={handleSubmit((form) =>
                    register(form.firstName, form.lastName, form.username, form.password)
                        .then(() => router.replace('/home'))
                        .catch(console.log)
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