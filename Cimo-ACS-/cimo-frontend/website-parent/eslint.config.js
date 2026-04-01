import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    js.configs.recommended, // Cấu hình chuẩn cho JS
    tseslint.configs.recommended, // Cấu hình chuẩn cho TypeScript
    {
        ignores: ['dist'],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser, // Thêm parser cho TypeScript
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'no-unused-vars': 'off', // Tắt cảnh báo biến không dùng cho JS
            '@typescript-eslint/no-unused-vars': 'off', // Tắt cảnh báo biến không dùng cho TS
        },
    },
];
