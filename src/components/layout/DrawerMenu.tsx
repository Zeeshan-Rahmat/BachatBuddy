// src/components/layout/DrawerMenu.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Left slide-in drawer menu.
// Opens when hamburger (≡) is pressed in AppHeader.
// Slides in from left over ~80% of screen width.
// Dark semi-transparent overlay covers the right side.
// ─────────────────────────────────────────────────────────────────────────────

import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuItem from '../menu/MenuItem';
import MenuItemsWrapper from '../menu/MenuItemsWrapper';
import ProfileCard from '../menu/ProfileCard';
// import { useSignOut } from '../../hooks/auth/useAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;
const ANIMATION_DURATION = 280;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  // const { user, role, canAccessDashboard, /* not to add */ canAccessBackup } = useAuthStore();
  // const { handleSignOut } = useSignOut();
  const segments = useSegments();

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  function canAccessDashboard() {
    return true
  }

  // ── Animation + Status Bar style ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      overlayOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    } else {
      translateX.value = withTiming(-DRAWER_WIDTH, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      overlayOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    }
  }, [isOpen]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none',
  }));

  // ── Swipe-to-close gesture ──────────────────────────────────────────────────
  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -DRAWER_WIDTH);
        overlayOpacity.value = 1 + e.translationX / DRAWER_WIDTH;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -DRAWER_WIDTH * 0.3 || e.velocityX < -500) {
        translateX.value = withTiming(-DRAWER_WIDTH, {
          duration: 200,
          easing: Easing.in(Easing.cubic),
        });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        overlayOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const navigate = useCallback(
    (route: string) => {
      onClose();
      setTimeout(() => router.push(route as any), 150);
    },
    [onClose]
  );

  const activeSegment = segments[1] ?? '';

  const isActive = (segment: string) => activeSegment === segment;

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    onClose();
    // await handleSignOut();
  }, [onClose]);
  // }, [onClose, handleSignOut]);

  if (!isOpen && translateX.value === -DRAWER_WIDTH) return null;

  return (
    <View
      className="absolute inset-0 z-50"
      style={{ width: SCREEN_WIDTH }}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      {/* Status bar turns dark when drawer is open (white bg visible) */}
      <StatusBar style={isOpen ? 'dark' : 'light'} />
      {/* Dark overlay — tap to close */}
      <Animated.View
        style={[overlayStyle, { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer panel */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View
          style={[
            drawerStyle,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: DRAWER_WIDTH,
              backgroundColor: COLORS.background,
            },
          ]}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 16,
              gap: 16,
            }}
          >

            {/* ── Section 1: Profile ─────────────────────────── */}

            <MenuItemsWrapper>

              {/* Profile row */}
              <ProfileCard />

            </MenuItemsWrapper>

            <MenuItemsWrapper>

              {/* Nav items — Section 2 */}
              {canAccessDashboard() && (
                <MenuItem
                  icon={ICONS.MENU.defaultDashboard}
                  activeIcon={ICONS.AUTH.dashboard}
                  label="Dashboard"
                  isActive={isActive('dashboard')}
                  onPress={() => navigate('/(app)/dashboard')}
                />
              )}
              <MenuItem
                icon={ICONS.MENU.customizeInvoice}
                label="Customize Invoice"
                onPress={() => navigate('/(modal)/customize-invoice')}
              />
              <MenuItem
                icon={ICONS.MENU.businessDetail}
                label="Business Detail"
                onPress={() => navigate('/(modal)/business-detail')}
              />
              <MenuItem
                icon={ICONS.MENU.notificationFilled}
                label="Notification"
                onPress={() => navigate('/(modal)/notifications')}
              />
              <MenuItem
                icon={ICONS.MENU.addfriend}
                label="Invite a Friend"
                onPress={() => navigate('/(modal)/invite')}
              />

            </MenuItemsWrapper>

            {/* ── Section 3: Export & Backup ───────────────────────────────── */}
            <MenuItemsWrapper>
              <MenuItem
                icon={ICONS.MENU.exportIcon}
                label="Export Reports"
                onPress={() => navigate('/(modal)/export')}
              />

              <MenuItem
                icon={ICONS.MENU.backupRestore}
                label="Backup and Restore"
                onPress={() => navigate('/(modal)/backup')}
              />
            </MenuItemsWrapper>

            {/* ── Section 4: Account ───────────────────────────────────────── */}
            <MenuItemsWrapper>
              <MenuItem
                icon={ICONS.MENU.touchID}
                label="Smart Login"
                onPress={() => navigate('/(auth)/manage-fingerprint')}
              />
              <MenuItem
                icon={ICONS.MENU.changePassword}
                label="Change Password"
                onPress={() => navigate('/(modal)/change-password')}
              />
              <MenuItem
                icon={ICONS.MENU.logout}
                label="Logout"
                isDanger
                onPress={handleLogout}
              />
            </MenuItemsWrapper>

          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}