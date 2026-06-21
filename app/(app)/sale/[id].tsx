import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import InfoField from '@/src/components/ui/InfoField'
import { COLORS } from '@/src/constants/theme'
import { formatDateTime } from '@/src/lib/DateFunctions'
import { mockInvoices } from '@/src/lib/sampleData'
import { InvoiceType } from '@/src/types/appTypes'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const InvoiceDetailScreen = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const invoice = mockInvoices.find(inv => inv.invoice_id === id);

    const [showMore, setShowMore] = useState(false)

    return (
        <ScreenWrapper
            title='Inovice Detail'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <SectionHeader
                    title={"INVOICE DETAIL"}
                    insteadOfViewMore='EDIT'

                    fontSize={18}
                    textColor={COLORS.dark100}
                    marginTop={0}
                    marginBottom={8}
                />

                <View className='flex-1 gap-5'>
                    <View className='bg-white p-4 rounded-button gap-2'>
                        {
                            invoice
                                ? <InvoiceDetail invoice={invoice} showMore={showMore} setShowMore={setShowMore} />
                                : <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                        }
                    </View>
                </View>

            </PaddingWrapper>
        </ScreenWrapper>
    )
}

export default InvoiceDetailScreen

interface InvoiceDetailProps {
    invoice: InvoiceType;
    showMore: boolean;
    setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
}

function InvoiceDetail({ invoice, showMore, setShowMore }: InvoiceDetailProps): React.JSX.Element {
    const statusColors = {
        'Paid': COLORS.success,
        'Pending': COLORS.warning,
        'Unpaid': COLORS.danger,
    }
    return (
        <>
            <InfoField label='Invoice No.' value={invoice.invoice_number} />
            <InfoField label='Due Date' value={formatDateTime(invoice.due_date)} />
            <InfoField label='Invoice Status' value={invoice.status} valueColor={statusColors[invoice.status]} />

            {
                showMore
                    ? (
                        <TouchableOpacity
                            onPress={() => setShowMore(false)}
                            className='gap-2'
                        >
                            <InfoField label='Created by' value={invoice.created_by.name} />
                            <InfoField label='Created at' value={formatDateTime(invoice.created_at)} />
                            <InfoField label='Updated by' value={invoice.last_updated_by.name} />
                            <InfoField label='Last Updated at' value={formatDateTime(invoice.last_updated_at)} />
                        </TouchableOpacity>
                    )
                    : (
                        <View className='flex-1 justify-center items-center '>
                            <TouchableOpacity
                                onPress={() => setShowMore(true)}
                                className='px-5 py-1.5 rounded-button w-fit bg-dark-50/10'
                            >
                                <Text className='text-sm font-medium'>See More</Text>
                            </TouchableOpacity>
                        </View>
                    )
            }



        </>
    )
}