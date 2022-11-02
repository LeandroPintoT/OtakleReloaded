const ESLintPlugin = require('eslint-webpack-plugin');
export const extensions = ['.js', '.vue', '.json'];
export const resolve = {
    alias: {
        // If using the runtime only build
        //'@c': path.resolve(__dirname, 'src/components'),
        'vue': 'vue/dist/vue.runtime.esm.js', // 'vue/dist/vue.runtime.common.js' for webpack 1
        // Or if using full build of Vue (runtime + compiler)
        // vue$: 'vue/dist/vue.esm.js'      // 'vue/dist/vue.common.js' for webpack 1
        plugins: [new ESLintPlugin()]
    }
};
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    externals: {
        vue: "Vue",
    },
    module: {
        rules: [
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
        ],
    },
};