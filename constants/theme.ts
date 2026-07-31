export const Colors = {
  background: '#FFFFFF',
  secondaryBg: '#F8F9FA',
  cardBg: '#F4F5F6',
  primaryText: '#1A1A1A',
  secondaryText: '#555555',
  border: '#EAEBED',

  primaryAccent: '#C18C5D', // Brand Caramel
  successAccent: '#708A81', // Sage Green
  alertAccent: '#A34A3D',   // Terracotta / Alert Red

  // Dynamic Cover Gradients (matching coverResId 1..5)
  coverGradients: {
    1: ['#2E3D52', '#1E2836'], // Slate/Navy
    2: ['#9E4B3E', '#753228'], // Rich Terracotta
    3: ['#5E756C', '#455A51'], // Soft Sage/Olive
    4: ['#3B2E20', '#261D13'], // Vintage Dark Walnut
    5: ['#917255', '#6E533A'], // Ancient Amber/Gold
    default: ['#C18C5D', '#91663F'], // Brand Caramel
  } as Record<number | string, [string, string]>
};

export const Fonts = {
  serif: 'Georgia',
  sans: 'System',
};
