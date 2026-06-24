import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import ListItemCard from '@/src/components/common/ListItemCard'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import DeleteModal from '@/src/components/modal/DeleteModal'
import InfoField from '@/src/components/ui/InfoField'
import InvoiceItemCard from '@/src/components/ui/InvoiceItemCard'
import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import { mockInvoices } from '@/src/lib/sampleData'
import { CustomerType, InvoiceType } from '@/src/types/appTypes'
import { formatDateTime } from '@/src/Utility/DateFunctions'
import { getStatusRGBColor } from '@/src/Utility/getStatusColor'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import EditInvoiceProductsModal from './edit-invoce-produts'
import EditInvoiceCustomerModal from './edit-invoice-customer'
import EditInvoiceDetailModal from './edit-invoice-detail'
import EditInvoiceSubtotalModal from './edit-invoice-subtotal'

const InvoiceDetailScreen = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const invoice = mockInvoices.find(inv => inv.invoice_id === id);

    const [selectedCustomer, setSelectedCustomer] = useState(invoice?.customer);
    const [selectedProducts, setSelectedProducts] = useState(invoice?.invoice_items);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditInvoiceDetailModalOpen, setIsEditInvoiceDetailModalOpen] = useState(false);
    const [isEditInvoiceCustomerModalOpen, setIsEditInvoiceCustomerModalOpen] = useState(false);
    const [isEditInvoiceProductsModalOpen, setIsEditInvoiceProductsModalOpen] = useState(false);
    const [isEditInvoiceSubtotalModalOpen, setIsEditInvoiceSubtotalModalOpen] = useState(false);

    const [showMore, setShowMore] = useState(false)


    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        router.back()
    }

    return (
        <ScreenWrapper
            title='Inovice Detail'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
            scrollable={false}
        >
            <PaddingWrapper addPaddingBottom={false}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className='flex-1'
                >
                    <SectionHeader
                        title={"INVOICE DETAIL"}
                        insteadOfViewMore='EDIT'

                        textColor={COLORS.dark100}
                        marginTop={0}
                        marginBottom={8}

                        onPress={() => setIsEditInvoiceDetailModalOpen(true)}
                    />

                    <View className='bg-white p-4 rounded-button gap-2'>
                        {
                            invoice
                                ? <InvoiceDetail invoice={invoice} showMore={showMore} setShowMore={setShowMore} />
                                : <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                        }
                    </View>

                    <SectionHeader
                        title={"CUSTOMER PROFILE"}
                        insteadOfViewMore='EDIT'

                        textColor={COLORS.dark100}
                        marginBottom={8}

                        onPress={() => setIsEditInvoiceCustomerModalOpen(true)}
                    />

                    {
                        invoice
                            ? <ListItemCard
                                item={selectedCustomer as CustomerType}
                                placeholder={ICONS.COMMON.customer}
                                isParty={true}

                                onPress={() => setIsEditInvoiceCustomerModalOpen(true)}
                            />
                            : <View className='bg-white p-4 rounded-button gap-2'>
                                <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                            </View>
                    }


                    <SectionHeader
                        title={"PRODUCTS DETAIL"}
                        insteadOfViewMore='EDIT'

                        marginTop={11}
                        textColor={COLORS.dark100}
                        marginBottom={8}


                        onPress={() => setIsEditInvoiceProductsModalOpen(true)}
                    />

                    {
                        invoice && selectedProducts
                            ? <>
                                {
                                    selectedProducts.map((invoiceItem) => {
                                        return <InvoiceItemCard key={invoiceItem.invoice_item_id} item={invoiceItem} />
                                    })
                                }
                            </>
                            : <View className='bg-white p-4 rounded-button gap-2'>
                                <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                            </View>
                    }
                </ScrollView>

            </PaddingWrapper>

            <View className='bg-white mt-2 p-4 pb-10 rounded-button gap-2'>
                {
                    invoice
                        ? (
                            <InvoiceTotal
                                invoice={invoice}
                                onDelete={() => setIsDeleteModalOpen(true)}
                                onPress={() => setIsEditInvoiceSubtotalModalOpen(true)}
                            />
                        )
                        : <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                }
            </View>


            {
                isDeleteModalOpen && (
                    invoice &&
                    <DeleteModal
                        title='Remove Invoice'
                        subtitle='You are going to remove below invoice'
                        removeItem={invoice.invoice_number}
                        isVisible={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDelete={handleDelete}
                    />
                )
            }

            {
                isEditInvoiceDetailModalOpen &&
                invoice &&
                <EditInvoiceDetailModal
                    visible={isEditInvoiceDetailModalOpen}
                    invoice={invoice}
                    onClose={() => setIsEditInvoiceDetailModalOpen(false)}
                />
            }

            {
                isEditInvoiceCustomerModalOpen &&
                invoice &&
                <EditInvoiceCustomerModal
                    visible={isEditInvoiceCustomerModalOpen}
                    selectedCustomer={selectedCustomer}
                    onClose={() => setIsEditInvoiceCustomerModalOpen(false)}
                    setSelectedCustomer={setSelectedCustomer}
                />
            }

            {
                isEditInvoiceProductsModalOpen &&
                invoice &&
                <EditInvoiceProductsModal
                    visible={isEditInvoiceProductsModalOpen}
                    selectedProducts={selectedProducts}
                    onClose={() => setIsEditInvoiceProductsModalOpen(false)}
                    setSelectedProducts={setSelectedProducts}
                />
            }


            {
                isEditInvoiceSubtotalModalOpen &&
                invoice &&
                <EditInvoiceSubtotalModal
                    visible={isEditInvoiceSubtotalModalOpen}
                    invoice={invoice}
                    onClose={() => setIsEditInvoiceSubtotalModalOpen(false)}
                />
            }

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
    return (
        <>
            <InfoField label='Invoice No.' value={invoice.invoice_number} />
            <InfoField label='Due Date' value={formatDateTime(invoice.due_date)} />
            <InfoField label='Invoice Status' value={invoice.status} valueColor={getStatusRGBColor(invoice.status)} />

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

interface InvoiceTotalProps {
    invoice: InvoiceType,
    onDelete: () => void,
    onPress: () => void
}


function InvoiceTotal({
    invoice,
    onDelete,
    onPress
}: InvoiceTotalProps
): React.JSX.Element {

    const statusColors = {
        'Paid': COLORS.success,
        'Pending': COLORS.warning,
        'Unpaid': COLORS.danger,
    }
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                className='gap-2'
            >
                <InfoField
                    label='Total Items'
                    value={invoice.total_items.toString()} />

                <InfoField
                    label='Subtotal'
                    value={invoice.subtotal.toLocaleString() + " PKR"} />

                <InfoField
                    label={'Discount ' + invoice.discount + "%"}
                    value={"- " + invoice.discount_amount.toLocaleString() + " PKR"} />

                <InfoField
                    label='Total Amount'
                    value={invoice.total_amount.toLocaleString() + " PKR"} />

                <InfoField
                    label='Received Amount'
                    value={"- " + invoice.paid_amount.toLocaleString() + " PKR"} />

                <InfoField
                    label='Pending Due'
                    value={invoice.remaining_amount.toLocaleString() + " PKR"}
                    valueColor={statusColors[invoice.status]} />

            </TouchableOpacity>


            <View className='flex-row gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.deleteWhite} />}
                    label='REMOVE'
                    width='flex-1'
                    bgColor='red'
                    onPress={onDelete}
                />

                <Button
                    leftIcon={<MaterialCommunityIcons name="eye" size={24} color="white" />}
                    label='PREVIEW'
                    width='flex-1'
                />
            </View>

        </>
    )
}