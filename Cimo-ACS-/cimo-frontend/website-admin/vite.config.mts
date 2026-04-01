import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      viteTsconfigPaths(),
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
          },
        },
      }),
      eslintPlugin({
        cache: false,
        include: ['./src/**/*.tsx'],
        exclude: [],
      }),

      obfuscatorPlugin({
        include: [/.*\.js$/],
        exclude: [/node_modules/],
        apply: 'build',
        // debugger: true,
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 1,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['rc4'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 5,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 5,
          stringArrayWrappersType: 'function',
          stringArrayThreshold: 1,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
          exclude: [/node_modules/],
        },
      }),
    ],

    server: {
      open: true,
      port: 3000,
    },
    define: {
      global: 'globalThis',
      _: 'window._',
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[hash].js',
          chunkFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash].[ext]',
          sourcemapFileNames: 'maps/[hash].map',
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
    },
  };
});
