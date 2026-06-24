// app/(app)/reports/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import PartyReport from './party-report';
import SalesReport from './sales-report';
import StockReport from './stock-report';

const TABS = ['Sales', 'Stock', 'Parties'];

export default function ReportsScreen() {
    const [activeTab, setActiveTab] = useState('Sales');

    return (
        <ScreenWrapper scrollable={false}>

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper addPaddingBottom={false} hasLowPaddingTop>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >

                    {activeTab === 'Sales' && <SalesReport />}
                    {activeTab === 'Stock' && <StockReport />}
                    {activeTab === 'Parties' && <PartyReport />}

                </ScrollView>
            </PaddingWrapper>

        </ScreenWrapper>
    );
}