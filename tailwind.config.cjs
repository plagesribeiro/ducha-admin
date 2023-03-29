/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'src/**/*.ts*'
	],
	theme: {
		screens: {
			mobile: { max: '768px' }
		},
		extend: {
			fontFamily: {
				sans: 'Inter, sans-serif'
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};
