import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type { import("eslint").Linter.FlatConfig[] } */
export default tseslint.config([
	...eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		files: ['**/*.js', '**/*.ts'],
		plugins: {},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			indent: ['warn', 'tab'],
			'linebreak-style': ['warn', 'unix'],
			quotes: ['warn', 'single'],
			semi: ['warn', 'never'],
			'no-console': 'warn',
		},
	},
])
