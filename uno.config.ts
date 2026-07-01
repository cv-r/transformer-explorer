import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      surface: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary/90',
    'btn-secondary': 'btn bg-secondary text-white hover:bg-secondary/90',
    'card': 'bg-white rounded-xl shadow-lg p-6 border border-surface-200',
    'step-title': 'text-2xl font-bold text-surface-800',
    'step-desc': 'text-surface-600 leading-relaxed',
  },
})
