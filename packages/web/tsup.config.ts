import { defineConfig, type Options } from 'tsup'

const workletEntryConfig: Options = {
    treeshake: true,
    entry: {
        'vad.worklet.bundle': 'src/worklet.ts',
    },
    format: ['iife'],
}

export default defineConfig([
    {
        ...workletEntryConfig,
        minify: 'terser',
        outExtension() {
            return ({ js: '.min.js' })
        }
    },
    {
        ...workletEntryConfig,
        outExtension() {
            return ({ js: '.dev.js' })
        }
    }

])