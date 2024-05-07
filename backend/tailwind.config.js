/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content:  [
      './app/frontend/**/*.{js,ts,jsx,tsx}',
      './app/views/**/*.html.erb'
  ],
  theme: {
    extend: {
        backgroundImage: {
            'front': `radial-gradient(at 34% 68%, hsla(240,89%,81%,1) 0px, transparent 50%),
                         radial-gradient(at 0% 27%, hsla(304,100%,88%,0.96) 0px, transparent 50%),
                         radial-gradient(at 2% 97%, hsla(198,100%,80%,1) 0px, transparent 50%),
                         radial-gradient(at 99% 0%, hsla(227,96%,65%,1) 0px, transparent 50%),
                         radial-gradient(at 63% 40%, hsla(189,100%,78%,1) 0px, transparent 50%),
                         radial-gradient(at 89% 100%, hsla(268,79%,88%,1) 0px, transparent 50%),
                         radial-gradient(at 48% 0%, hsla(355,100%,93%,0.69) 0px, transparent 50%);`
        },
        backgroundColor: {
            'front': `hsla(218,98%,75%,1);`
        },
        fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans]
        }
    },
  },
  plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography')
  ],
}

