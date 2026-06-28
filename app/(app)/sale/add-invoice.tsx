import Button from '@/src/components/common/Button'
import IconWrapper from '@/src/components/common/IconWrapper'
import ListItemCard from '@/src/components/common/ListItemCard'
import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import DeleteModal from '@/src/components/modal/DeleteModal'
import InfoField from '@/src/components/ui/InfoField'
import InvoiceItemCard from '@/src/components/ui/InvoiceItemCard'
import { defaultInvoice } from '@/src/constants/defaultData'
import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import { createInvoice } from '@/src/db/repositories/invoicesRepository'
import { useAuthStore } from '@/src/store/authStore'
import { CustomerType, InvoiceItemType, InvoiceType } from '@/src/types/appTypes'
import { formatDateTime } from '@/src/Utility/DateFunctions'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import EditInvoiceProductsModal from './edit-invoce-produts'
import EditInvoiceCustomerModal from './edit-invoice-customer'
import EditInvoiceDetailModal from './edit-invoice-detail'
import EditInvoiceSubtotalModal from './edit-invoice-subtotal'

const AddInvoiceScreen = () => {
    const invoice = defaultInvoice;
    const currentUser = useAuthStore((state) => state.user);
    const requiresApproval = useAuthStore((state) => state.requiresApproval);

    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | undefined>(invoice.customer);
    const [selectedProducts, setSelectedProducts] = useState<InvoiceItemType[] | undefined>(invoice.invoice_items);
    const [discount, setDiscount] = useState(invoice.discount);
    const [discountAmount, setDiscountAmount] = useState(invoice.discount_amount);
    const [paidAmount, setPaidAmount] = useState(invoice.paid_amount);
    const [dueDate, setDueDate] = useState(invoice.due_date);
    const [invoiceImage, setInvoiceImage] = useState<string | undefined>(invoice.img);
    const [saving, setSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditInvoiceDetailModalOpen, setIsEditInvoiceDetailModalOpen] = useState(false);
    const [isEditInvoiceCustomerModalOpen, setIsEditInvoiceCustomerModalOpen] = useState(false);
    const [isEditInvoiceProductsModalOpen, setIsEditInvoiceProductsModalOpen] = useState(false);
    const [isEditInvoiceSubtotalModalOpen, setIsEditInvoiceSubtotalModalOpen] = useState(false);

    const [showMore, setShowMore] = useState(false);

    const draftInvoice = useMemo<InvoiceType>(() => {
        const invoiceItems = selectedProducts ?? [];
        const subtotal = invoiceItems.reduce((total, item) => total + item.quantity * item.selling_price, 0);
        const totalAmount = Math.max(0, subtotal - discountAmount);
        const remainingAmount = Math.max(0, totalAmount - paidAmount);
        const totalItems = invoiceItems.reduce((total, item) => total + item.quantity, 0);
        const status = totalAmount <= 0 || paidAmount >= totalAmount
            ? 'Paid'
            : paidAmount > 0
                ? 'Pending'
                : 'Unpaid';

        return {
            ...invoice,
            customer: selectedCustomer ?? invoice.customer,
            invoice_items: invoiceItems,
            subtotal,
            discount,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            paid_amount: paidAmount,
            remaining_amount: remainingAmount,
            total_items: totalItems,
            status,
            due_date: dueDate,
            img: invoiceImage,
        };
    }, [discount, discountAmount, dueDate, invoice, invoiceImage, paidAmount, selectedCustomer, selectedProducts]);


    const handleDelete = () => {
        setIsDeleteModalOpen(false);
        router.back()
    }

    const handleSaveInvoice = async () => {
        if (!selectedProducts || selectedProducts.length === 0) {
            Alert.alert('Select products', 'Add at least one product before saving this invoice.');
            return;
        }

        setSaving(true);

        try {
            await createInvoice({
                createdById: currentUser?.id ?? null,
                customerId: selectedCustomer?.customer_id || null,
                dueDate: new Date(draftInvoice.due_date).getTime(),
                paidAmount,
                discount,
                discountAmount,
                img: invoiceImage ?? null,
                items: selectedProducts.map((item) => ({
                    productId: item.product.product_id,
                    quantity: item.quantity,
                    sellingPrice: item.selling_price,
                })),
                requiresApproval: requiresApproval(),
            });

            router.back();
        } catch (error) {
            Alert.alert('Save failed', error instanceof Error ? error.message : 'Unable to save this invoice locally.');
        } finally {
            setSaving(false);
        }
    };

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
                            draftInvoice
                                ? <InvoiceDetail invoice={draftInvoice} showMore={showMore} setShowMore={setShowMore} />
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
                        draftInvoice
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
                        draftInvoice && selectedProducts
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
                    draftInvoice
                        ? (
                            <InvoiceTotal
                                invoice={draftInvoice}
                                onDelete={() => setIsDeleteModalOpen(true)}
                                onPress={() => setIsEditInvoiceSubtotalModalOpen(true)}
                                primaryLabel={saving ? 'SAVING...' : 'SAVE'}
                                onPrimaryPress={handleSaveInvoice}
                            />
                        )
                        : <Text className='text-xl text-dark-50 text-center font-semibold'>Not Found</Text>
                }
            </View>


            {
                isDeleteModalOpen && (
                    draftInvoice &&
                    <DeleteModal
                        title='Remove Invoice'
                        subtitle='You are going to remove below invoice'
                        removeItem={draftInvoice.invoice_number}
                        isVisible={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDelete={handleDelete}
                    />
                )
            }

            {
                isEditInvoiceDetailModalOpen &&
                draftInvoice &&
                <EditInvoiceDetailModal
                    visible={isEditInvoiceDetailModalOpen}
                    invoice={draftInvoice}
                    onClose={() => setIsEditInvoiceDetailModalOpen(false)}
                    onDraftChange={(values) => {
                        setDueDate(values.due_date);
                        setInvoiceImage(values.img);
                    }}
                />
            }

            {
                isEditInvoiceCustomerModalOpen &&
                draftInvoice &&
                <EditInvoiceCustomerModal
                    visible={isEditInvoiceCustomerModalOpen}
                    selectedCustomer={selectedCustomer}
                    onClose={() => setIsEditInvoiceCustomerModalOpen(false)}
                    setSelectedCustomer={setSelectedCustomer}
                />
            }

            {
                isEditInvoiceProductsModalOpen &&
                draftInvoice &&
                <EditInvoiceProductsModal
                    visible={isEditInvoiceProductsModalOpen}
                    selectedProducts={selectedProducts}
                    onClose={() => setIsEditInvoiceProductsModalOpen(false)}
                    setSelectedProducts={setSelectedProducts}
                />
            }


            {
                isEditInvoiceSubtotalModalOpen &&
                draftInvoice &&
                <EditInvoiceSubtotalModal
                    visible={isEditInvoiceSubtotalModalOpen}
                    invoice={draftInvoice}
                    onClose={() => setIsEditInvoiceSubtotalModalOpen(false)}
                    onDraftChange={(nextSubtotal) => {
                        setDiscount(nextSubtotal.discount);
                        setDiscountAmount(nextSubtotal.discount_amount);
                        setPaidAmount(nextSubtotal.paid_amount);
                    }}
                />
            }

        </ScreenWrapper>
    )
}

export default AddInvoiceScreen

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

interface InvoiceTotalProps {
    invoice: InvoiceType,
    onDelete: () => void,
    onPress: () => void,
    primaryLabel?: string,
    onPrimaryPress?: () => void
}


function InvoiceTotal({
    invoice,
    onDelete,
    onPress,
    primaryLabel = 'PREVIEW',
    onPrimaryPress
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
                    label={primaryLabel}
                    width='flex-1'
                    onPress={onPrimaryPress}
                />
            </View>

        </>
    )
}
