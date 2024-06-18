import { Control, useController } from 'react-hook-form';
import { View, StyleSheet, TextInput } from 'react-native'

type TextInputProps = {
    control: Control<any, any>;
    name: string;
    placeholder?: string;
    secureTextEntry?: boolean;
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
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        width: '100%'
    },
    input: {
        fontSize: 16,
        width: '100%',
    }
})