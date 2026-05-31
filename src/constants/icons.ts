import role from "@assets/icons/Connected Filled.png";
import dropdown from '@assets/icons/Dropdown Filled.png';
import hide from '@assets/icons/Hide Filled.png';
import password from "@assets/icons/Password Filled.png";
import show from '@assets/icons/Show Filled.png';
import user from '@assets/icons/User Filled.png';


export const ICONS = {
    user,
    role,
    password,
    dropdown,
    show,
    hide
} as const;

export type IconKey = keyof typeof ICONS;