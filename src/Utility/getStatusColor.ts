import { COLORS } from "../constants/theme";
import { StatusColorType } from "../types/appTypes";

import { ColorValue } from "react-native";

const successColors: { bg: string; text: string } = { bg: 'bg-success/10', text: 'text-success' }
const warningColors: { bg: string; text: string } = { bg: 'bg-warning/10', text: 'text-warning' }
const dangerColors: { bg: string; text: string } = { bg: 'bg-danger/10', text: 'text-danger' }

const statusRGBColors = {
    success: COLORS.success,
    warning: COLORS.warning,
    danger: COLORS.danger,
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'In Stock': successColors,
    'Low Stock': warningColors,
    'Out of Stock': dangerColors,
    'Paid': successColors,
    'Pending': warningColors,
    'Unpaid': dangerColors,
    'Active': successColors,
    'Inactive': dangerColors,
};

const STATUS_COLORS_RBG: Record<StatusColorType, ColorValue> = {
    'In Stock': statusRGBColors.success,
    'Active': statusRGBColors.success,
    'Paid': statusRGBColors.success,

    'Low Stock': statusRGBColors.warning,
    'Pending': statusRGBColors.warning,

    'Out of Stock': statusRGBColors.danger,
    'Unpaid': statusRGBColors.danger,
    'Inactive': statusRGBColors.danger,
};

export function getStatusColor(status: string) {
    return STATUS_COLORS[status] ?? STATUS_COLORS['In Stock'];
}

export function getStatusRGBColor(status: StatusColorType) {
    return STATUS_COLORS_RBG[status] ?? STATUS_COLORS['Active']
}