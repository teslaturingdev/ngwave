/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./projects/ngwave-ui/tailwind.config.js')],
  content: ['./projects/**/*.{html,ts}'],
};
