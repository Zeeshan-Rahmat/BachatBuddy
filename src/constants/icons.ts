// Auth Defaults Icons
import dashboard from '@assets/icons/auth/default/dashboard.png';
import dropdown from '@assets/icons/auth/default/dropdown.png';
import email from '@assets/icons/auth/default/email.png';
import fingerprint from '@assets/icons/auth/default/fingerprint.png';
import hide from '@assets/icons/auth/default/hide.png';
import largeFingerprint from '@assets/icons/auth/default/largeFingerprint.png';
import largeVerified from '@assets/icons/auth/default/largeVerified.png';
import otp from '@assets/icons/auth/default/otp.png';
import password from "@assets/icons/auth/default/password.png";
import role from "@assets/icons/auth/default/role.png";
import show from '@assets/icons/auth/default/show.png';
import user from '@assets/icons/auth/default/user.png';

// Auth Active Icons
import activeDropdown from '@assets/icons/auth/active/activeDropdown.png';
import activeEmail from '@assets/icons/auth/active/activeEmail.png';
import activeHide from '@assets/icons/auth/active/activeHide.png';
import activeOTP from '@assets/icons/auth/active/activeOTP.png';
import activePassword from "@assets/icons/auth/active/activePassword.png";
import activeRole from "@assets/icons/auth/active/activeRole.png";
import activeShow from '@assets/icons/auth/active/activeShow.png';
import activeUser from '@assets/icons/auth/active/activeUser.png';

// Top Bar Icons
import menu from '@assets/icons/top-bar/menu.png';
import notificationOutline from '@assets/icons/top-bar/notificationOutline.png';

// Bottom Navigation Icons
// Filled
import homeFilled from "@assets/icons/bottom-nav/homeFilled.png";
import partiesFilled from "@assets/icons/bottom-nav/partiesFilled.png";
import reportsFilled from "@assets/icons/bottom-nav/reportsFilled.png";
import salesFilled from "@assets/icons/bottom-nav/salesFilled.png";
import stockFilled from "@assets/icons/bottom-nav/stockFilled.png";

// Outlined
import homeOutline from "@assets/icons/bottom-nav/homeOutline.png";
import partiesOutline from "@assets/icons/bottom-nav/partiesOutline.png";
import reportsOutline from "@assets/icons/bottom-nav/reportsOutline.png";
import salesOutline from "@assets/icons/bottom-nav/salesOutline.png";
import stockOutline from "@assets/icons/bottom-nav/stockOutline.png";


// Dashboard Icons


export const ICONS = {
    AUTH: {
        // Defaults Icons
        user,
        role,
        password,
        dropdown,
        show,
        hide,
        fingerprint,
        largeFingerprint,
        email,
        otp,
        largeVerified,
        dashboard,

        // Active Icons
        activeUser,
        activeRole,
        activePassword,
        activeDropdown,
        activeShow,
        activeHide,
        activeEmail,
        activeOTP
    },
    TOP_BAR: {
        menu,
        notificationOutline
    },
    BOTTOM_NAV: {
        // Filled
        homeFilled,
        stockFilled,
        salesFilled,
        reportsFilled,
        partiesFilled,

        // Ouline
        homeOutline,
        stockOutline,
        salesOutline,
        reportsOutline,
        partiesOutline,
    },
    DASHBOARD: {},
} as const;

export type IconKey = keyof typeof ICONS;