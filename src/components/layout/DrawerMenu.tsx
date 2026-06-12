// src/components/layout/DrawerMenu.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Left slide-in drawer menu.
// Opens when hamburger (≡) is pressed in AppHeader.
// Slides in from left over ~80% of screen width.
// Dark semi-transparent overlay covers the right side.
// ─────────────────────────────────────────────────────────────────────────────

import { router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
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
import { useAuthStore } from '../../store/authStore';
// import { useSignOut } from '../../hooks/auth/useAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;
const ANIMATION_DURATION = 280;

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  isDanger?: boolean;
  ownerOnly?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const { user, role, canAccessDashboard, canAccessBackup } = useAuthStore();
  // const { handleSignOut } = useSignOut();
  const segments = useSegments();

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

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
              backgroundColor: '#F1F3F6',
            },
          ]}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 12,
              gap: 10,
            }}
          >

            {/* ── Section 1: Profile + Navigation ─────────────────────────── */}
            <View className="bg-white rounded-2xl overflow-hidden">

              {/* Profile row */}
              <View className="flex-row items-center px-4 py-4 border-b border-slate-100">
                {user?.avatar_url ? (
                  <Image
                    source={{ uri: user.avatar_url }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center mr-3">
                    <Text className="text-emerald-700 font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase() ?? 'U'}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-base" numberOfLines={1}>
                    {user?.username ?? 'User'}
                  </Text>
                  <Text className="text-slate-400 text-xs" numberOfLines={1}>
                    {user?.email ?? ''}
                  </Text>
                </View>
                {/* Edit profile icon */}
                <TouchableOpacity
                  onPress={() => navigate('/(modal)/profile-edit')}
                  className="p-1.5"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={{ fontSize: 18, color: '#64748b' }}>✏️</Text>
                </TouchableOpacity>
              </View>

              {/* Nav items — Section 1 */}
              {canAccessDashboard() && (
                <MenuItem
                  icon="⊞"
                  label="Dashboard"
                  isActive={isActive('dashboard')}
                  onPress={() => navigate('/(app)/dashboard')}
                />
              )}
              <MenuItem
                icon="🧾"
                label="Customize Invoice"
                onPress={() => navigate('/(modal)/customize-invoice')}
              />
              <MenuItem
                icon="🏢"
                label="Business Detail"
                onPress={() => navigate('/(modal)/business-detail')}
              />
              <MenuItem
                icon="🔔"
                label="Notification"
                onPress={() => navigate('/(modal)/notifications')}
              />
              <MenuItem
                icon="👥"
                label="Invite a Friend"
                onPress={() => navigate('/(modal)/invite')}
              />
            </View>

            {/* ── Section 2: Export & Backup ───────────────────────────────── */}
            <View className="bg-white rounded-2xl overflow-hidden">
              <MenuItem
                icon="📤"
                label="Export Reports"
                onPress={() => navigate('/(modal)/export')}
              />
              {canAccessBackup() && (
                <MenuItem
                  icon="☁️"
                  label="Backup and Restore"
                  onPress={() => navigate('/(modal)/backup')}
                />
              )}
            </View>

            {/* ── Section 3: Account ───────────────────────────────────────── */}
            <View className="bg-white rounded-2xl overflow-hidden">
              <MenuItem
                icon="🫆"
                label="Smart Login"
                onPress={() => navigate('/(auth)/manage-fingerprint')}
              />
              <MenuItem
                icon="🔒"
                label="Change Password"
                onPress={() => navigate('/(modal)/change-password')}
              />
              <MenuItem
                icon="🚪"
                label="Logout"
                isDanger
                onPress={handleLogout}
              />
            </View>

          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

function MenuItem({ icon, label, onPress, isActive, isDanger }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-3.5 ${isActive ? 'bg-emerald-500' : 'bg-white'
        }`}
    >
      {/* Icon circle */}
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${isActive ? 'bg-white/20' : 'bg-slate-100'
          }`}
      >
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>

      {/* Label */}
      <Text
        className={`text-base font-medium ${isDanger
            ? 'text-rose-500'
            : isActive
              ? 'text-white'
              : 'text-slate-700'
          }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}