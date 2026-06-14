export const ROUTES = {
    AUTH: {
        SIGN_IN: "/sign-in",
        SIGN_UP: "/sign-up",
        SIGN_UP_OTP: "/sign-up-otp",
        SIGN_UP_VERIFIED: "/sign-up-verified",

        VERIFY_OTP: "/verify-otp",
        EMAIL_VERIFIED: "/email-verified",

        FINGERPRINT: "/fingerprint",
        MANAGE_FINGERPRINT: "/manage-fingerprint",

        FORGOT_PASSWORD: "/forgot-password",
        NEW_PASSWORD: "/new-password",
        PASSWORD_UPDATED: "/password-updated",
    },

    MODAL: {
        PROFILE: "/profile",
        NOTIFICATION: "/notification",
    },

    DASHBOARD: "/dashboard",
    STOCK: "/stock",
    SALE: "/sale",
    REPORTS: "/reports",
    PARTIES: "/parties",

    SPLASH_SCREEN: "/",

    USER_DETAILS: (id: string | number) =>
        `/user/${id}` as const,

    PRODUCT_DETAILS: (slug: string) =>
        `/product/${slug}` as const,
} as const;