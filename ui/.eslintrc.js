module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-control-statements/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "no-trailing-spaces": ["error"],
        semi: ["error"],
        quotes: ["error", "double"],
        "comma-dangle": ["error", "always-multiline"],
        "react/jsx-no-undef": ["error", { allowGlobals: true }],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "explicit",
                overrides: {
                    constructors: "no-public",
                },
            },
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "no-multiple-empty-lines": ["error", { max: 1 }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-use-before-define": "off",
    },
    globals: { __DEV__: "readonly" },
    settings: {
        react: {
            version: "detect",
        },
    },
    plugins: ["@typescript-eslint", "jsx-control-statements", "react-hooks"],
    parserOptions: {
        project: "./tsconfig.json",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                "react/prop-types": "off",
            },
        },
    ],
};
