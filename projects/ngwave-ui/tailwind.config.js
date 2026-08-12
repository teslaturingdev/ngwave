/*
 * NgWave shared Tailwind preset.
 * Consumers extend this and add '@ngwave/ui' to their `content` so utility
 * classes used inside NgWave components are generated in their build.
 */
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

const scale = (name) =>
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].reduce(
    (acc, step) => ({ ...acc, [step]: withOpacity(`--${name}-${step}`) }),
    {},
  );

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        nw: scale('nw'),
        surface: { 0: withOpacity('--surface-0'), ...scale('surface') },
      },
      borderRadius: {
        nw: 'var(--nw-radius)',
        'nw-lg': 'var(--nw-radius-lg)',
      },
      boxShadow: {
        'nw-sm': 'var(--nw-shadow-sm)',
        nw: 'var(--nw-shadow)',
        'nw-md': 'var(--nw-shadow-md)',
        'nw-lg': 'var(--nw-shadow-lg)',
        'nw-xl': 'var(--nw-shadow-xl)',
        'nw-glow': 'var(--nw-glow)',
      },
      transitionTimingFunction: {
        nw: EASE,
        'nw-bounce': BOUNCE,
      },
      keyframes: {
        'nw-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'nw-scale-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'nw-slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'nw-slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'nw-slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'nw-slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'nw-drawer-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'nw-drawer-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'nw-drawer-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'nw-drawer-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'nw-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'nw-check': {
          from: { opacity: '0', transform: 'scale(0.4)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'nw-shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'nw-fade-in': 'nw-fade-in 0.2s ease-out both',
        'nw-scale-in': `nw-scale-in 0.2s ${EASE} both`,
        'nw-slide-down': `nw-slide-down 0.16s ${EASE} both`,
        'nw-slide-up': `nw-slide-up 0.16s ${EASE} both`,
        'nw-slide-in-right': `nw-slide-in-right 0.28s ${EASE} both`,
        'nw-slide-in-left': `nw-slide-in-left 0.28s ${EASE} both`,
        'nw-drawer-right': `nw-drawer-right 0.3s ${EASE} both`,
        'nw-drawer-left': `nw-drawer-left 0.3s ${EASE} both`,
        'nw-drawer-up': `nw-drawer-up 0.3s ${EASE} both`,
        'nw-drawer-down': `nw-drawer-down 0.3s ${EASE} both`,
        'nw-pop': `nw-pop 0.22s ${BOUNCE} both`,
        'nw-check': `nw-check 0.18s ${BOUNCE} both`,
        'nw-shimmer': 'nw-shimmer 1.6s infinite',
      },
    },
  },
};
