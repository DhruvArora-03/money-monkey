import 'raf/polyfill'
import 'setimmediate'
import '../global.css'

import { Provider } from 'app/provider'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

export default async function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Solito Example App</title>
        <meta
          name="description"
          content="Expo + Next.js with Solito. By Fernando Rojo."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}
