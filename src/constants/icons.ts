// Defaults Icons
import dropdown from '@assets/icons/default/dropdown.png';
import hide from '@assets/icons/default/hide.png';
import password from "@assets/icons/default/password.png";
import role from "@assets/icons/default/role.png";
import show from '@assets/icons/default/show.png';
import user from '@assets/icons/default/user.png';

// Active Icons
import activeDropdown from '@assets/icons/active/activeDropdown.png';
import activeHide from '@assets/icons/active/activeHide.png';
import activePassword from "@assets/icons/active/activePassword.png";
import activeRole from "@assets/icons/active/activeRole.png";
import activeShow from '@assets/icons/active/activeShow.png';
import activeUser from '@assets/icons/active/activeUser.png';


export const ICONS = {
    user,
    role,
    password,
    dropdown,
    show,
    hide,
    activeUser,
    activeRole,
    activePassword,
    activeDropdown,
    activeShow,
    activeHide,
} as const;

export type IconKey = keyof typeof ICONS;