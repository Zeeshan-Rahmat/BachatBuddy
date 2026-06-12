// src/hooks/useDrawer.ts
// Simple hook to manage drawer open/close state.
// Used in ScreenWrapper so every screen gets the drawer for free.

import { useCallback, useState } from 'react';

export function useDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    const openDrawer = useCallback(() => setIsOpen(true), []);
    const closeDrawer = useCallback(() => setIsOpen(false), []);
    const toggleDrawer = useCallback(() => setIsOpen((v) => !v), []);

    return { isOpen, openDrawer, closeDrawer, toggleDrawer };
}