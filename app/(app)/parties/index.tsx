// app/(app)/parties/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import { useAuthStore } from '@/src/store/authStore';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import CustomerScreen from './customer';
import EmployeeScreen from './employee';
import SupplierScreen from './supplier';

const OWNER_TABS = ['Customers', 'Suppliers', 'Employees'];
const EMPLOYEE_TABS = ['Customers', 'Suppliers'];

export default function PartiesScreen() {
    const role = useAuthStore((state) => state.role);
    const tabs = useMemo(() => role === 'owner' ? OWNER_TABS : EMPLOYEE_TABS, [role]);
    const [activeTab, setActiveTab] = useState('Customers');
    const visibleActiveTab = tabs.includes(activeTab) ? activeTab : tabs[0];

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>

                <InternalTabBar tabs={tabs} activeTab={visibleActiveTab} setActiveTab={setActiveTab} />

                {visibleActiveTab === 'Customers' && <CustomerScreen />}
                {visibleActiveTab === 'Suppliers' && <SupplierScreen />}
                {role === 'owner' && visibleActiveTab === 'Employees' && <EmployeeScreen />}

            </ScreenWrapper>

        </View>
    );
}
