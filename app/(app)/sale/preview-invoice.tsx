import Button from '@/src/components/common/Button';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import { COLORS, SHADOWS } from '@/src/constants/theme';
import { getInvoiceByIdWithRelations } from '@/src/db/repositories/invoicesRepository';
import { mapInvoiceToPreviewData } from '@/src/services/invoice/invoicePreviewMapper';
import { mapInvoiceRowToAppInvoice } from '@/src/services/invoice/invoiceUiMapper';
import InvoiceViewer from '@/src/services/invoice/invoiceViewer';
import {
    generateAndShareInvoice,
    printInvoice,
    saveInvoicePdfWithPicker,
} from '@/src/services/invoice/pdfService';
import { useAuthStore } from '@/src/store/authStore';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import { DEFAULT_CUSTOMIZATION, type InvoiceCustomization, type InvoiceData } from '@/src/types/invoice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

type PreviewAction = 'print' | 'share' | 'save';

const PreviewInvoiceScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const currentUser = useAuthStore((state) => state.user);
    const signature = useInvoiceCustomizationStore((state) => state.signature);

    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeAction, setActiveAction] = useState<PreviewAction | null>(null);

    const customization = useMemo<InvoiceCustomization>(() => ({
        ...DEFAULT_CUSTOMIZATION,
        signature: signature
            ? {
                label: signature.label,
                imageUri: signature.dataUri,
            }
            : DEFAULT_CUSTOMIZATION.signature,
    }), [signature]);

    const loadInvoice = useCallback(async () => {
        if (!id) {
            setInvoiceData(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const row = await getInvoiceByIdWithRelations(id);
            const mappedInvoice = row ? mapInvoiceRowToAppInvoice(row) : null;
            setInvoiceData(mappedInvoice ? mapInvoiceToPreviewData(mappedInvoice, currentUser) : null);
        } catch {
            Alert.alert('Load failed', 'Unable to load this invoice preview from local storage.');
        } finally {
            setLoading(false);
        }
    }, [currentUser, id]);

    useEffect(() => {
        void loadInvoice();
    }, [loadInvoice]);

    const handleAction = async (action: PreviewAction) => {
        if (!invoiceData) {
            return;
        }

        setActiveAction(action);

        try {
            if (action === 'print') {
                await printInvoice(invoiceData, customization);
            } else if (action === 'share') {
                await generateAndShareInvoice(invoiceData, customization);
            } else {
                const fileUri = await saveInvoicePdfWithPicker(invoiceData, customization);

                if (fileUri) {
                    Alert.alert('Invoice saved', 'Your invoice PDF has been saved.');
                }
            }
        } catch {
            Alert.alert('Action failed', 'Unable to complete this invoice action. Please try again.');
        } finally {
            setActiveAction(null);
        }
    };

    return (
        <ScreenWrapper

            title='Inovice Preview'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
            scrollable={false}
        >

            <View className='flex-1 px-6 pt-7'>
                <View
                    className='flex-1 bg-white overflow-hidden'
                    style={SHADOWS.card}
                >
                    {loading ? (
                        <View className='flex-1 items-center justify-center'>
                            <ActivityIndicator color={COLORS.navy400} />
                        </View>
                    ) : invoiceData ? (
                        <InvoiceViewer invoiceData={invoiceData} customization={customization} />
                    ) : (
                        <View className='flex-1 items-center justify-center px-6'>
                            <Text className='text-xl font-semibold text-dark-100 text-center'>Invoice not found</Text>
                        </View>
                    )}
                </View>
            </View>

            <View className='px-8 pt-4 pb-10 flex-row justify-between items-start gap-6 bg-white'>
                <PreviewIconAction
                    icon='printer'
                    label='Print'
                    loading={activeAction === 'print'}
                    disabled={!invoiceData || Boolean(activeAction)}
                    onPress={() => handleAction('print')}
                />

                <PreviewIconAction
                    icon='share-variant'
                    label='Share'
                    loading={activeAction === 'share'}
                    disabled={!invoiceData || Boolean(activeAction)}
                    onPress={() => handleAction('share')}
                />


                <Button
                    width='w-fit'
                    label='SAVE'
                    leftIcon={<MaterialCommunityIcons name='content-save' size={28} color={COLORS.white} />}

                    isDisabled={!invoiceData || Boolean(activeAction)}
                    onPress={() => handleAction('save')}
                />
            </View>
        </ScreenWrapper>
    );
};

interface PreviewIconActionProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    loading: boolean;
    disabled: boolean;
    onPress: () => void;
}

function PreviewIconAction({ icon, label, loading, disabled, onPress }: PreviewIconActionProps): React.JSX.Element {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled}
            className='w-20 h-16 mt-1.5 items-center justify-center'
            onPress={onPress}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.navy400} />
            ) : (
                <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color={disabled ? COLORS.dark50 : COLORS.navy400}
                />
            )}
            <Text className={`text-base font-semibold mt-1 ${disabled ? 'text-dark-50' : 'text-navy-400'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default PreviewInvoiceScreen;
