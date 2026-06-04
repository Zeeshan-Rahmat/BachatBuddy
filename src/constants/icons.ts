// Defaults Icons
import dashboard from '@assets/icons/default/dashboard.png';
import dropdown from '@assets/icons/default/dropdown.png';
import email from '@assets/icons/default/email.png';
import fingerprint from '@assets/icons/default/fingerprint.png';
import hide from '@assets/icons/default/hide.png';
import largeFingerprint from '@assets/icons/default/largeFingerprint.png';
import largeVerified from '@assets/icons/default/largeVerified.png';
import otp from '@assets/icons/default/otp.png';
import password from "@assets/icons/default/password.png";
import role from "@assets/icons/default/role.png";
import show from '@assets/icons/default/show.png';
import user from '@assets/icons/default/user.png';

// Active Icons
import activeDropdown from '@assets/icons/active/activeDropdown.png';
import activeEmail from '@assets/icons/active/activeEmail.png';
import activeHide from '@assets/icons/active/activeHide.png';
import activeOTP from '@assets/icons/active/activeOTP.png';
import activePassword from "@assets/icons/active/activePassword.png";
import activeRole from "@assets/icons/active/activeRole.png";
import activeShow from '@assets/icons/active/activeShow.png';
import activeUser from '@assets/icons/active/activeUser.png';


export const ICONS = {
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
} as const;

export type IconKey = keyof typeof ICONS;