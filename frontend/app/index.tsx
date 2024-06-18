import { router } from "expo-router";

export default function DefaultScreen() {
    if (router.canDismiss()) {
        router.dismissAll()
    } else {
        router.replace('/welcome')
    }

    return <></>
}