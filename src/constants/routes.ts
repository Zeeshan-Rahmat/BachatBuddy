export const ROUTES = {
    // Public / Auth Routes
    AUTH: {
        SIGN_IN: '/sign-in',
        SIGN_UP: '/sign-up',
        SIGN_UP_VERIFIED: '/sign-up-verified',
        EMAIL_VERIFIED: '/email-verified',
        VERIFY_OTP: '/verify-otp',
        FINGERPRINT: '/fingerprint',
        MANAGE_FINGERPRINT: '/manage-fingerprint',
        FORGOT_PASSWORD: '/forgot-password',

        NEW_PASSWORD: '/new-password',
        PASSWORD_UPDATED: '/password-updated',
        SIGN_UP_OTP: '/sign-up-otp',
    },

    // Main App Tabs / Screens
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Dynamic Routes (e.g., /user/123)
    // Use a function for routes that require IDs or slugs
    USER_DETAILS: (id: string | number) => `/user/${id}` as const,
    PRODUCT_DETAILS: (slug: string) => `/product/${slug}` as const,
} as const; // "as const" makes the object values strictly read-only types