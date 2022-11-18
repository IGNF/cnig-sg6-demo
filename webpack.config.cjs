const fs = require('fs');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV;
const debugBuild = mode === 'development';

/*
   configuring babel:
   - when babel runs alone (for `test-unit` for instance), we let him deal with
   ES6 modules, because node doesn't support them yet (planned for v10 lts).
   - however, webpack also has ES6 module support and these 2 don't play well
   together. When running webpack (either `build` or `start` script), we prefer
   to rely on webpack loaders (much more powerful and gives more possibilities),
   so let's disable modules for babel here.
   - we also dynamise the value of __DEBUG__ according to the env var
*/
// Note that we don't support .babelrc in parent folders
const babelrc = fs.readFileSync(path.resolve(__dirname, '.babelrc'));

const babelConf = JSON.parse(babelrc);
babelConf.babelrc = false; // disabel babelrc reading, as we've just done it

const replacementPluginConf = babelConf.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'minify-replace');
if (replacementPluginConf && replacementPluginConf[1]) {
    replacementPluginConf[1].replacements.find(decl => decl.identifierName === '__DEBUG__').replacement.value = debugBuild;
}

const include = [
    path.resolve(__dirname, 'src')
];

module.exports = () => {
    const babelLoaderOptions = [];
    babelLoaderOptions.push({
        loader: 'babel-loader',
        options: babelConf
    });

    return {
        mode,
        context: path.resolve(__dirname),
        resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules']
        },
        entry: {
            editeurPluCnig: [
                './src/Main.js'
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            library: '[name]',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include,
                    use: babelLoaderOptions
                },
                {
                    test: /skin\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /content\.css$/i,
                    use: ['css-loader']
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin({ patterns: [{ from: 'assets/tinymce/langs', to: 'langs' }] }),
            new MiniCssExtractPlugin(),
            new ESLintPlugin({ files: include })
        ],
        devServer: {
            devMiddleware: {
                publicPath: '/dist/',
            },
            static: path.resolve(__dirname, './'),
            client: {
                overlay: {
                    errors: true,
                    warnings: false
                }
            }
        }
    };
};
