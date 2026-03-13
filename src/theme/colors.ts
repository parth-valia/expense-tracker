export const Colors = {
  // Backgrounds
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#222240',
  card: '#16213E',

  // Primary accent — vibrant teal-cyan gradient
  primary: '#00D9FF',
  primaryDark: '#0097B2',
  primaryLight: '#7DF9FF',

  // Secondary accent — warm coral
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',

  // Text
  textPrimary: '#EAEAEA',
  textSecondary: '#A0A0B8',
  textMuted: '#6C6C80',

  // Semantic
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',

  // Category colors
  categories: {
    Food: '#FF6B6B',
    Transport: '#4ADE80',
    Shopping: '#FBBF24',
    Entertainment: '#A78BFA',
    Bills: '#38BDF8',
    Health: '#FB923C',
    Education: '#34D399',
    Other: '#94A3B8',
  } as Record<string, string>,

  // Borders / dividers
  border: '#2A2A45',
  divider: '#1E1E35',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
};
