/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CircularDependecyPlugin = require("circular-dependency-plugin");
const jsonImporter = require("node-sass-json-importer");

let config;
try {
    config = require("./config.json");
} catch (error) {
    config = {};
}

let vars;
try {
    // Optional file with additional webpack setup.
    // Keys supported:
    // analyzeBundle: If bundle's size should be analyzed. Possible values: false, "dev", "prod", "all"|true. Default: false
    // appToBuild: Which application should be built. Possible values: "all", name of application. Default: "all"
    // apiUrl: Url to API to be used
    // loggingDisabled: Possible values: true, false. Default: false
    vars = require("./webpack.config.variables.js");
} catch (error) {
    vars = {};
}

const BUILD_DIR = path.resolve(__dirname, "output");
const SRC_DIR = path.resolve(__dirname, "src");

console.log("BUILD_DIR", BUILD_DIR);
console.log("SRC_DIR", SRC_DIR);

module.exports = (env = {}) => {
    const devMode = !env.prod;
    const GLOBALS = {
        "process.env.APP_ENV": JSON.stringify(config.environment),
        "process.env.NODE_ENV": JSON.stringify(config.environment),
        __DEV__: devMode,
    };
    console.log(GLOBALS);

    const analyzeBundle =
        vars.analyzeBundle === true ||
        (vars.analyzeBundle == "dev" && devMode) ||
        (vars.analyzeBundle == "prod" && !devMode);

    const plugins = [
        new webpack.DefinePlugin(GLOBALS),
        devMode && new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: `apps/[name]/[name].styles.[${devMode ? "hash" : "contenthash"
                }].css`,
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            chunks: ["root", "runtime", "vendors"],
            chunksSortMode: "none",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "public/img", to: "img", noErrorOnMissing: true },
                { from: "./config.json", to: "./config.json" },
            ],
        }),
        new webpack.HashedModuleIdsPlugin(),
        analyzeBundle && new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /he|ru|pt/),
        new WorkboxWebpackPlugin.GenerateSW({
            exclude: [
                /\.map$/,
                /^manifest.*\.js(?:on)?$/, //default value
                /\.jpg$/,
                /\.png$/,
                /\.gif$/,
            ],
        }),
        new CircularDependecyPlugin({
            failOnError: true,
            exclude: /[\\/]node_modules[\\/]/,
        }),
    ];

    return {
        mode: devMode ? "development" : "production",
        resolve: {
            alias: {
                src: path.resolve("./src"),
                "@core": path.resolve("./src/core"),
                "@components": path.resolve("./src/components"),
                "@shared": path.resolve("./src/components/_shared"),
                "@img": path.resolve("./public/img"),
                "@services": path.resolve("./src/services"),
            },
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        node: {
            fs: "empty",
        },
        entry: {
            root: ["@babel/polyfill", SRC_DIR + "/apps/root.ts"],
        },
        output: {
            path: BUILD_DIR,
            filename: `apps/[name]/[name].bundle.[${devMode ? "hash" : "contenthash"
                }].js`,
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
            minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
        },
        devtool: devMode ? "eval-source-map" : false,
        devServer: {
            contentBase: BUILD_DIR,
            compress: true,
            hot: true,
            historyApiFallback: devMode,
            port: 8090,
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                },
                {
                    test: /\.html$/,
                    loader: "html-loader",
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "./img/[name].[hash].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "./fonts/[name].[hash].[ext]",
                    },
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    importer: jsonImporter(),
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: plugins.filter((plugin) => plugin),
    };
};
