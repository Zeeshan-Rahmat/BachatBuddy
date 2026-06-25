// app/(app)/parties/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomerScreen from './customer';
import EmployeeScreen from './employee';
import SupplierScreen from './supplier';

const TABS = ['Customers', 'Suppliers', 'Employees'];

export default function PartiesScreen() {

    const [activeTab, setActiveTab] = useState('Customers');

    return (
        <View className="flex-1">
            <ScreenWrapper scrollable={false}>

                <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === 'Customers' && <CustomerScreen />}
                {activeTab === 'Suppliers' && <SupplierScreen />}
                {activeTab === 'Employees' && <EmployeeScreen />}

            </ScreenWrapper>

        </View>
    );
}