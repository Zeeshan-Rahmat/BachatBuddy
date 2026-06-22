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
        BUSINES_PROFILE: "/business_profile",
        CHANGE_PASSWORD: "/change_password",
        EXPORT_REPORT: "/export",
        SMART_LOGIN: "/smart_login",
        INVITE_FRIEND: "/invite_friend",
        BACKUP_RESTORE: "/backup_restore",
        CUSTOMIZE_INVOICE: "/customize_invoice",
        SIGNATURE_PAD: "/customize_invoice/signature-pad",
    },

    DASHBOARD: "/dashboard",
    STOCK: "/stock",

    SALE: {
        INDEX: "/sale",
        INVOICE_DETAILS: "/sale/[id]",
        ADD_INVOICE: "/sale/add-invoice",
    },

    REPORTS: "/reports",
    PARTIES: "/parties",

    SPLASH_SCREEN: "/",

} as const;