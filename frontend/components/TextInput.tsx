import { Control, FieldError, useController } from 'react-hook-form';
import { Text, View, StyleSheet, TextInput } from 'react-native'

type TextInputProps = {
    control: Control<any, any>;
    name: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: FieldError;
}

export default function CustomTextInput(props: TextInputProps) {
    const { field } = useController({
        control: props.control,
        name: props.name,
    })
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
            />
            {props.error && <Text style={styles.error}>{props.error.message}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        width: '100%',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textTransform: 'capitalize'
    }
})