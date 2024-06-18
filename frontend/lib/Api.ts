import * as Crypto from 'expo-crypto';
import { LoginResponse } from './Types';

const url = 'http://localhost:8080'

function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    return (
        Crypto
            .digest(Crypto.CryptoDigestAlgorithm.SHA256, passwordBuffer)
            .then((hashBuffer) =>
                Array.from(new Uint8Array(hashBuffer))
                    .map((byte) => byte.toString(16).padStart(2, "0"))
                    .join("")
            )
    );
}

export async function logIn(username: string, password: string): Promise<LoginResponse> {
    var hashed = await hashPassword(password.toLowerCase())

    return fetch(url + '/auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username.toLowerCase(),
            password: hashed
        }),
    })
        .then(async (response) => {
            if (response.ok) {
                return response.json()
            }

            const text = await response.text();
            throw new Error(`fetch error /auth/login - ${response.status}: ${text}`);
        })
        .then(json => ({ token: json.token } satisfies LoginResponse))
}

