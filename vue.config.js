import { resolve } from 'path'
import { defineConfig } from '@vue/cli-service'
import * as url from 'url';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    publicPath: process.env.NODE_ENV === 'production'
                ? '/Otakle/'
                : '/',
    "transpileDependencies": [
        "vuetify"
    ],
    devServer: {
        port:8081
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@c': resolve(__dirname, 'src/components'),
                '@a': resolve(__dirname, 'src/assets'),
                '@ajs': resolve(__dirname, 'src/assets/js'),
                '@pub': resolve(__dirname, 'public')
            },
        },
    },
})