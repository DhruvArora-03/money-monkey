const { withExpo } = require('@expo/next-adapter')
const fs = require('fs')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reanimated (and thus, Moti) doesn't work with strict mode currently...
  // https://github.com/nandorojo/moti/issues/224
  // https://github.com/necolas/react-native-web/pull/2330
  // https://github.com/nandorojo/moti/issues/224
  // once that gets fixed, set this back to true
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'solito',
    'moti',
    'app',
    'react-native-reanimated',
    'nativewind',
    'react-native-gesture-handler',
    'victory-native',
    '@shopify/react-native-skia',
  ],
  experimental: {
    forceSwcTransforms: true,
    esmExternals: 'loose',
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => ({
    ...config,
    plugins: [
      ...config.plugins,
      // 1. Ensure wasm file availability
      new (class CopySkiaPlugin {
        apply(compiler) {
          compiler.hooks.thisCompilation.tap('AddSkiaPlugin', (compilation) => {
            compilation.hooks.processAssets.tapPromise(
              {
                name: 'copy-skia',
                stage:
                  compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
              },
              async () => {
                const src = require.resolve('./plugins/canvaskit.wasm')
                if (!compilation.getAsset(src)) {
                  compilation.emitAsset(
                    '/canvaskit.wasm',
                    new webpack.sources.RawSource(
                      await fs.promises.readFile(src),
                    ),
                  )
                }
              },
            )
          })
        }
      })(),
      // 2. Polyfill fs and path modules
      new NodePolyfillPlugin(),
    ],
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // 3. Suppress reanimated module warning
        // This assumes Reanimated is installed, if not you can use false.
        'react-native-reanimated/package.json': require.resolve(
          'react-native-reanimated/package.json',
        ),
        'react-native-reanimated': require.resolve('react-native-reanimated'),
        'react-native/Libraries/Image/AssetRegistry': false,
      },
    },
  }),
}

module.exports = withExpo(nextConfig)
