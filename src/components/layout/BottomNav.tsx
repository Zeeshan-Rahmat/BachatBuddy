// src/components/layout/BottomNav.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Custom bottom tab bar matching the design exactly:
// - Navy (#1B3A6B) background
// - Active tab: white icon + white bold label + green underline dot
// - Inactive tab: semi-transparent white icon + label
// - 5 tabs: Home, Stock, Sale, Reports, Parties
// ─────────────────────────────────────────────────────────────────────────────

import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { router, useSegments } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconWrapper from '../common/IconWrapper';
// import { useAuthStore } from '../../store/authStore';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const ALL_TABS = [
    {
        key: 'dashboard',
        label: 'Home',
        route: ROUTES.DASHBOARD,
        segment: 'dashboard',
        icon: HomeIcon,
        ownerOnly: true,   // AGENTS.md: Employee cannot access Dashboard
    },
    {
        key: 'stock',
        label: 'Stock',
        route: ROUTES.STOCK,
        segment: 'stock',
        icon: StockIcon,
        ownerOnly: false,
    },
    {
        key: 'sale',
        label: 'Sale',
        route: ROUTES.SALE.INDEX,
        segment: 'sale',
        icon: SaleIcon,
        ownerOnly: false,
    },
    {
        key: 'reports',
        label: 'Reports',
        route: ROUTES.REPORTS,
        segment: 'reports',
        icon: ReportsIcon,
        ownerOnly: true,   // AGENTS.md: Employee cannot access Reports
    },
    {
        key: 'parties',
        label: 'Parties',
        route: ROUTES.PARTIES,
        segment: 'parties',
        icon: PartiesIcon,
        ownerOnly: false,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav() {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    //   const { role } = useAuthStore();
    const role = "owner"

    // Filter tabs based on RBAC role
    const visibleTabs = ALL_TABS.filter(
        (tab) => !tab.ownerOnly || role === 'owner'
    );

    // Determine active tab from current route segment
    const activeSegment = segments[1] ?? 'dashboard';

    return (
        <View
            style={{ paddingBottom: insets.bottom }}
            className="bg-[#1B3A6B] flex-row"
        >
            {visibleTabs.map((tab) => {
                const isActive = activeSegment === tab.segment ||
                    // handle employee default landing on stock
                    (activeSegment === undefined && tab.segment === 'stock');

                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => router.push(tab.route as any)}
                        activeOpacity={0.7}
                        className="flex-1 items-center justify-center pt-3 pb-2"
                    >
                        {/* Active indicator line at top */}
                        {isActive && (
                            <View className="absolute top-0 left-4 right-4 h-0.5 bg-primary-400 rounded-full" />
                        )}

                        {/* Icon */}
                        <tab.icon active={isActive} />

                        {/* Label */}
                        <Text
                            className={`text-xs mt-1 ${isActive
                                ? 'text-white font-bold'
                                : 'text-white/60 font-normal'
                                }`}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ─── SVG-free Tab Icons (Text-based, matches design style) ───────────────────

function HomeIcon({ active }: { active: boolean }) {
    return (
        <View className="items-center justify-center w-7 h-7">
            <IconWrapper
                name={active ? ICONS.BOTTOM_NAV.homeFilled : ICONS.BOTTOM_NAV.homeOutline}
                className={active ? "opacity-100" : "opacity-70"}
            />
        </View>
    );
}

function StockIcon({ active }: { active: boolean }) {
    return (
        <View className="items-center justify-center w-7 h-7">
            <IconWrapper
                name={active ? ICONS.BOTTOM_NAV.stockFilled : ICONS.BOTTOM_NAV.stockOutline}
                className={active ? "opacity-100" : "opacity-70"}
            />
        </View>
    );
}

function SaleIcon({ active }: { active: boolean }) {
    return (
        <View className="items-center justify-center w-7 h-7">
            <IconWrapper
                name={active ? ICONS.BOTTOM_NAV.salesFilled : ICONS.BOTTOM_NAV.salesOutline}
                className={active ? "opacity-100" : "opacity-70"}
            />
        </View>
    );
}

function ReportsIcon({ active }: { active: boolean }) {
    return (
        <View className="items-center justify-center w-7 h-7">
            <IconWrapper
                name={active ? ICONS.BOTTOM_NAV.reportsFilled : ICONS.BOTTOM_NAV.reportsOutline}
                className={active ? "opacity-100" : "opacity-70"}
            />
        </View>
    );
}

function PartiesIcon({ active }: { active: boolean }) {
    return (
        <View className="items-center justify-center w-7 h-7">
            <IconWrapper
                name={active ? ICONS.BOTTOM_NAV.partiesFilled : ICONS.BOTTOM_NAV.partiesOutline}
                className={active ? "opacity-100" : "opacity-70"}
            />
        </View>
    );
}