// app/(app)/reports/index.tsx
import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import PlaceHolderReport from '@/src/components/report/PlaceHolderReport';
import ScreenWrapper from '@components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import SalesReport from './sales-report';

const TABS = ['Sales', 'Stock', 'Parties'];

export default function ReportsScreen() {
    const [activeTab, setActiveTab] = useState('Sales');

    return (
        <ScreenWrapper scrollable={false}>

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >

                    {activeTab === 'Sales' && <SalesReport />}
                    {activeTab === 'Stock' && <PlaceHolderReport title="Stock Reports" />}
                    {activeTab === 'Parties' && <PlaceHolderReport title="Parties Reports" />}

                </ScrollView>
            </PaddingWrapper>

        </ScreenWrapper>
    );
}