import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import type { InvoiceTemplateId } from '@/src/types/invoice';
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomizeInvoiceColorsScreen from './customize-invoice-color';
import CustomizeInvoiceOptionScreen from './customize-invoice-option';
import CustomizeInvoiceTemplateScreen from './customize-invoice-template';

export interface InvoiceTemplate {
    id: InvoiceTemplateId;
    name: string;
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'bold', name: 'Bold' },
];

const TABS = ['Templates', 'Colors', 'Options'];

const CustomizeInvoiceScreen = () => {
    const [activeTab, setActiveTab] = useState('Templates');
    const templateId = useInvoiceCustomizationStore((state) => state.customization.templateId);
    const setTemplateId = useInvoiceCustomizationStore((state) => state.setTemplateId);

    return (
        <ScreenWrapper
            title='Customize Invoice'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
            scrollable={false}
        >

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>

                <View className="flex-1">

                    {
                        activeTab === TABS[0]
                            ? (
                                <CustomizeInvoiceTemplateScreen
                                    templates={INVOICE_TEMPLATES}
                                    selectedTemplateId={templateId}
                                    setSelectedTemplateId={setTemplateId}
                                />
                            )

                            : (
                                activeTab === TABS[1]
                                    ? <CustomizeInvoiceColorsScreen />
                                    : <CustomizeInvoiceOptionScreen />
                            )
                    }

                </View>

            </PaddingWrapper>
        </ScreenWrapper>
    )
}

export default CustomizeInvoiceScreen
