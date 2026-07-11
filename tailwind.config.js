module.exports = {
  theme: {
    extend: {
      keyframes: {
        spinIn: {
          "0%": { transform: "rotate(-360deg) scale(0)", opacity: "0" },
          "100%": { transform: "rotate(0) scale(1)", opacity: "1" },
        },
        fadeUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        spinIn: "spinIn 1s ease-out",
        fadeUp: "fadeUp 0.8s ease-out",
      },
      colors: {
        ink: "var(--haleel-ink)",
        charcoal: "var(--haleel-charcoal)",
        panel: "var(--haleel-panel)",
        gold: {
          DEFAULT: "var(--haleel-gold)",
          soft: "var(--haleel-gold-soft)",
        },
        copper: "var(--haleel-copper)",
        ivory: "var(--haleel-ivory)",
      },
      spacing: {
        'scale-1': 'var(--space-1)',
        'scale-2': 'var(--space-2)',
        'scale-3': 'var(--space-3)',
        'scale-4': 'var(--space-4)',
        'scale-6': 'var(--space-6)',
        'scale-8': 'var(--space-8)',
        'scale-12': 'var(--space-12)',
        'scale-16': 'var(--space-16)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      zIndex: {
        elevated: 'var(--z-elevated)',
        sticky: 'var(--z-sticky)',
        dropdown: 'var(--z-dropdown)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
    },
  },
  plugins: [],
};
