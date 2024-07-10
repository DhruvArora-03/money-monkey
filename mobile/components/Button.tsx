import { View, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native'

type ButtonProps = {
    style?: {
        padding?: number,
    };
    title: string;
    color: string;
    outline?: boolean;
    onPress?: ((event: GestureResponderEvent) => void);
    disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    return (
        <Pressable
            style={styles.container}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            {({ pressed }) =>
                <View
                    style={[
                        styles.button,
                        {
                            padding: props.style?.padding ?? 10,
                            borderColor: props.color,
                            backgroundColor: props.outline
                                ? (pressed ? props.color : undefined)
                                : (pressed ? 'dark' + props.color : props.color)
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.text,
                            { color: !props.outline || pressed ? 'white' : props.color }
                        ]}>
                        {props.title}
                    </Text>
                </View>
            }
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        alignContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16
    }
})