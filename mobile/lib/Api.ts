import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { LinkTokenResponse } from './Models';

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

export async function checkAuth(): Promise<boolean> {
    var accessToken = await SecureStore.getItemAsync('accessToken')

    if (accessToken == null) {
        return false
    }

    return fetch(`${url}/auth/verify`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).then((response) => response.ok).catch(() => false)
}

export async function logIn(username: string, password: string): Promise<void> {
    var hashed = await hashPassword(password)

    return fetch(`${url}/auth/login`, {
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
        .then(async json => {
            await SecureStore.setItemAsync('accessToken', json.access_token)
            await SecureStore.setItemAsync('refreshToken', json.refresh_token)
        })
}

export async function logOut() {
    await SecureStore.deleteItemAsync('accessToken')
    await SecureStore.deleteItemAsync('refreshToken')
}

export async function register(firstName: string, lastName: string, username: string, password: string): Promise<void> {
    var hashed = await hashPassword(password)

    return fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName.toLowerCase(),
            last_name: lastName.toLowerCase(),
            username: username.toLowerCase(),
            password: hashed
        }),
    })
        .then(async (response) => {
            if (response.ok) {
                return response.json()
            }

            const text = await response.text();
            throw new Error(`fetch error /auth/register - ${response.status}: ${text}`);
        })
        .then(async json => {
            await SecureStore.setItemAsync('accessToken', json.access_token)
            await SecureStore.setItemAsync('refreshToken', json.refresh_token)
        })
}

export async function getLinkToken(): Promise<LinkTokenResponse> {
    var accessToken = await SecureStore.getItemAsync('accessToken')

    if (accessToken == null) {
        throw new Error('not authorized')
    }

    return fetch(`${url}/plaid/create-link-token`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
    })
        .then(async (response) => {
            if (response.ok) {
                return response.json()
            }

            const text = await response.text();
            throw new Error(`fetch error /plaid/create-link-token - ${response.status}: ${text}`);
        })
        .then(json => ({ linkToken: json.link_token }))
}

export async function exchangePublicToken(publicToken: string) {
    var accessToken = await SecureStore.getItemAsync('accessToken')

    if (accessToken == null) {
        throw new Error('not authorized')
    }

    var response = await fetch(`${url}/plaid/generate-access-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            publicToken
        }),
    })

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`fetch error /plaid/generate-access-token - ${response.status}: ${text}`);
    }

    console.log('EXCHANGED')
}