/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1e3a8a', // Deep maritime blue - blue-800
        'primary-50': '#eff6ff', // Very light blue - blue-50
        'primary-100': '#dbeafe', // Light blue - blue-100
        'primary-500': '#3b82f6', // Medium blue - blue-500
        'primary-600': '#2563eb', // Darker blue - blue-600
        'primary-700': '#1d4ed8', // Dark blue - blue-700
        'primary-900': '#1e3a8a', // Deep maritime blue - blue-900

        // Secondary Colors
        'secondary': '#3b82f6', // Lighter ocean blue - blue-500
        'secondary-50': '#eff6ff', // Very light blue - blue-50
        'secondary-100': '#dbeafe', // Light blue - blue-100
        'secondary-200': '#bfdbfe', // Light blue - blue-200
        'secondary-300': '#93c5fd', // Medium light blue - blue-300
        'secondary-400': '#60a5fa', // Medium blue - blue-400
        'secondary-600': '#2563eb', // Darker blue - blue-600

        // Accent Colors
        'accent': '#ea580c', // Shipping industry orange - orange-600
        'accent-50': '#fff7ed', // Very light orange - orange-50
        'accent-100': '#ffedd5', // Light orange - orange-100
        'accent-200': '#fed7aa', // Light orange - orange-200
        'accent-500': '#f97316', // Medium orange - orange-500
        'accent-700': '#c2410c', // Dark orange - orange-700

        // Background Colors
        'background': '#f8fafc', // Soft neutral - slate-50
        'surface': '#ffffff', // Pure white - white
        'surface-50': '#f8fafc', // Very light gray - slate-50
        'surface-100': '#f1f5f9', // Light gray - slate-100
        'surface-200': '#e2e8f0', // Light gray - slate-200

        // Text Colors
        'text-primary': '#1f2937', // Near-black - gray-800
        'text-secondary': '#6b7280', // Medium gray - gray-500
        'text-tertiary': '#9ca3af', // Light gray - gray-400
        'text-inverse': '#ffffff', // White text - white

        // Status Colors
        'success': '#059669', // Professional green - emerald-600
        'success-50': '#ecfdf5', // Very light green - emerald-50
        'success-100': '#d1fae5', // Light green - emerald-100
        'success-500': '#10b981', // Medium green - emerald-500
        'success-700': '#047857', // Dark green - emerald-700

        'warning': '#d97706', // Amber for caution - amber-600
        'warning-50': '#fffbeb', // Very light amber - amber-50
        'warning-100': '#fef3c7', // Light amber - amber-100
        'warning-500': '#f59e0b', // Medium amber - amber-500
        'warning-700': '#b45309', // Dark amber - amber-700

        'error': '#dc2626', // Clear red for critical - red-600
        'error-50': '#fef2f2', // Very light red - red-50
        'error-100': '#fee2e2', // Light red - red-100
        'error-500': '#ef4444', // Medium red - red-500
        'error-700': '#b91c1c', // Dark red - red-700

        // Border Colors
        'border': '#e5e7eb', // Light border - gray-200
        'border-light': '#f3f4f6', // Very light border - gray-100
        'border-dark': '#d1d5db', // Medium border - gray-300
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'pulse-subtle': 'pulse-subtle 2s infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'navigation': '1000',
        'dropdown': '1010',
        'alert': '1020',
        'modal': '1030',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}