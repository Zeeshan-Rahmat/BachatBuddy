import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomizeInvoiceColorsScreen from './customize-invoice-color';
import CustomizeInvoiceOptionScreen from './customize-invoice-option';
import CustomizeInvoiceTemplateScreen from './customize-invoice-template';

// 1. Mock Type Definition for Templates
export interface InvoiceTemplate {
    id: string;
    name: string;
    thumbnail: string; // Replace with local require() or URI path
}

const MOCK_TEMPLATES: InvoiceTemplate[] = [
    { id: 'temp_1', name: 'Classic Purple', thumbnail: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200' },
    { id: 'temp_2', name: 'Modern Minimal', thumbnail: 'https://images.unsplash.com/photo-1780228725486-cfd6f7a651e8?w=200' },
    { id: 'temp_3', name: 'Professional Blue', thumbnail: 'https://images.unsplash.com/photo-1780303062451-49cf76588245?w=200' },
    { id: 'temp_4', name: 'Elegant Dark', thumbnail: 'https://images.unsplash.com/photo-1777328638754-7e3ece672060?w=200' },
];

const TABS = ['Templates', 'Colors', 'Options'];

const CustomizeInvoiceScreen = () => {
    const [activeTab, setActiveTab] = useState('Templates');
    const [selectedTemplateId, setSelectedTemplateId] = useState('temp_1');

    const selectedTemplateIndex = parseInt(selectedTemplateId.split("_")[1]) - 1;

    const selectedTamplateImage = MOCK_TEMPLATES[selectedTemplateIndex].thumbnail

    return (
        <ScreenWrapper
            title='Customize Invoice'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >

            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>

                <View className="flex-1">

                    {
                        activeTab == TABS[0]
                            ? (
                                <CustomizeInvoiceTemplateScreen
                                    mockData={MOCK_TEMPLATES}
                                    selectedTamplateImage={selectedTamplateImage}
                                    selectedTemplateId={selectedTemplateId}
                                    setSelectedTemplateId={setSelectedTemplateId}
                                />
                            )

                            : (
                                activeTab == TABS[1]
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