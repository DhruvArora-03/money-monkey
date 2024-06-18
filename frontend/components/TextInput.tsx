import { Control, useController } from 'react-hook-form';
import { View, StyleSheet, TextInput } from 'react-native'

type TextInputProps = {
    control: Control<any, any>;
    name: string;
    placeholder?: string
    secureTextEntry?: boolean;
}

export default function CustomTextInput(props: TextInputProps) {
    const { field } = useController({
        control: props.control,
        name: props.name,
    })
    return (
        <View>
            <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 2,
        flex: 1
    },
    button: {
        alignContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})