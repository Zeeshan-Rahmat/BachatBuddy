export const COLORS = {

    primaryGreen: '#22C55E',
    darkGreen: '#1E8C5A',

    primaryNavy: '#1E3A8A',
    darkNavy: '#1B3A6B',

    primaryTeal: '#1A7A6E',

    background: '#F5F5F5',

    placeholder: '#84878B',

    // --- Primary Brand (Green) ---
    primary50: '#E8F8EF',
    primary100: '#C6EDDA',
    primary200: '#92DDB8',
    primary300: '#5ECE96',
    primary400: '#22C55E', // Main Primary
    primary500: '#1A9E56',
    primary600: '#147A42',
    primary700: '#0F5A31',
    primary800: '#0A3D21',
    primary900: '#052010',

    // --- Navy ---
    navy50: '#E8ECF5',
    navy100: '#C5CFEA',
    navy200: '#8DA0D5',
    navy300: '#5470BF',
    navy400: '#1E3A8A', // Main Navy
    navy500: '#162E55',
    navy600: '#112240',
    navy700: '#0C182C',
    navy800: '#070E1A',
    navy900: '#03060D',

    // --- Teal ---
    teal400: '#1A7A6E',
    teal500: '#1E8C5A',

    // --- Light ---
    light50: '#97A0A9',
    light100: '#D9D9D9',
    light200: '#E2E2E3',
    light300: '#F5F5F5',

    // --- Dark ---
    dark50: '#84878B',
    dark100: '#606060',
    dark200: '#505050',
    dark300: '#252525',

    // --- Status & Neutrals ---
    success: '#2ECC71',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',
    surface: '#F5F6FA',
    card: '#FFFFFF',
    border: '#D9D9D9',
    muted: '#ADB5BD',

    // --- Common Defaults ---
    white: '#FFFFFF',
    black: '#000000',
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