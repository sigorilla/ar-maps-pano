module.exports = {
    extends: [
        'loris/es2017',
        'loris-react'
    ],
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true
    },
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        },
        allowImportExportEverywhere: true
    },
    settings: {
        react: {
            version: '16.2.0'
        }
    },
    plugins: ['react', 'babel'],
    rules: {
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['error', {'extensions': ['.js', '.jsx']}],
        'react/prefer-stateless-function': 'off',

        'no-invalid-this': 'off',
        'babel/no-invalid-this': 'error'
    }
};
