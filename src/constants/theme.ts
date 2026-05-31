export const COLORS = {
    primaryGreen: '#22C55E',
    primaryNavy: '#1E3A8A',
    primaryTeal: '#1A7A6E',
    background: '#97A0A9',
    placeholder: '#84878B',
    card: '#FFFFFF',
    border: '#D9D9D9',
    white: '#FFFFFF',
    black: '#000000',
    success: '#2ECC71',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',
};

export const TYPOGRAPHY = {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 22, fontWeight: '700' as const },
    h3: { fontSize: 18, fontWeight: '600' as const },
    h4: { fontSize: 16, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    bodySmall: { fontSize: 13, fontWeight: '400' as const },
    caption: { fontSize: 11, fontWeight: '400' as const },
    label: { fontSize: 13, fontWeight: '600' as const },
    button: { fontSize: 16, fontWeight: '700' as const },
};

export const SPACING = {
    xs: 4, sm: 8, md: 12, base: 16,
    lg: 20, xl: 24, xxl: 32, xxxl: 40,
};

export const RADIUS = {
    sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};

export const SHADOWS = {
    card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    header: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 6 },
    fab: { shadowColor: '#2ECC71', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
};

export const CHART_COLORS = {
    green: '#2ECC71',
    blue: '#3498DB',
    orange: '#F39C12',
    red: '#E74C3C',
    navy: '#1B3A6B',
    teal: '#1A7A6E',
    purple: '#9B59B6',
    yellow: '#F1C40F',
};