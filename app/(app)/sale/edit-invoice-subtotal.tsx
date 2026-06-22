import Button from '@/src/components/common/Button';
import IconWrapper from '@/src/components/common/IconWrapper';
import InputText from '@/src/components/common/InputText';
import Title from '@/src/components/common/Title';
import CustomeModal from '@/src/components/modal/CustomModal';
import IconButton from '@/src/components/ui/IconButton';
import InfoField from '@/src/components/ui/InfoField';
import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { InvoiceType } from '@/src/types/appTypes';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react';
import { View } from 'react-native';

interface EditInvoiceSubtotalModalProps {
    visible: boolean;
    invoice: InvoiceType;
    onClose: () => void;
}

const statusColors = {
    'Paid': COLORS.success,
    'Pending': COLORS.warning,
    'Unpaid': COLORS.danger,
};

const EditInvoiceSubtotalModal = ({ visible, invoice, onClose }: EditInvoiceSubtotalModalProps) => {
    const [loading, setLoading] = useState(false);
    const [isPercent, setIsPercent] = useState(false);

    const [paidAmountInput, setPaidAmountInput] = useState(invoice.paid_amount.toString());
    const [discountInput, setDiscountInput] = useState(invoice.discount_amount.toString());

    const [errors, setErrors] = useState({ paidAmount: '', discount: '' });

    const subtotal = invoice.subtotal;
    const parsedDiscount = parseFloat(discountInput) || 0;
    const parsedPaidAmount = parseFloat(paidAmountInput) || 0;

    const discountAmount = isPercent
        ? (parsedDiscount / 100) * subtotal
        : parsedDiscount;

    const discountPercent = isPercent
        ? parsedDiscount
        : subtotal > 0 ? (parsedDiscount / subtotal) * 100 : 0;

    const calculatedTotal = Math.max(0, subtotal - discountAmount);
    const pendingDue = Math.max(0, calculatedTotal - parsedPaidAmount);

    // --- HANDLERS ---
    const handleToggleType = () => {
        setIsPercent(!isPercent);
        setDiscountInput(
            !isPercent
                ? discountPercent.toFixed(1).replace(/\.0$/, '')
                : discountAmount.toString()
        );
    };

    const validate = () => {
        const e = { paidAmount: '', discount: '', };
        let valid = true;
        if (paidAmountInput === '') { e.paidAmount = 'Paid amount is required'; valid = false; }
        if (discountInput === '') { e.discount = 'Discount value is required'; valid = false; }
        setErrors(e);
        return valid;
    };

    const handleUpdate = async () => {
        if (!validate()) return;
        setLoading(true);

        // Pass these cleanly calculated values to your backend API or global state handler
        const payload = {
            discount: discountPercent,
            discount_amount: discountAmount,
            total_amount: calculatedTotal,
            paid_amount: parsedPaidAmount,
            pending_due: pendingDue
        };

        console.log("Saving payload: ", payload);
        // Add your update dispatch/mutations here
        setLoading(false);
    };

    return (
        <CustomeModal visible={visible}>
            <Title text='Edit Invoice Amount' />

            <InputText
                icon={<IconWrapper name={ICONS.STOCK.purchaseMoney} />}
                activeIcon={<IconWrapper name={ICONS.STOCK.activePurchaseMoney} />}
                placeholder="Enter paid amount"
                value={paidAmountInput}
                onChangeText={(t) => { setPaidAmountInput(t); setErrors(e => ({ ...e, paidAmount: '' })); }}
                error={errors.paidAmount}
                keyboardType='numeric'
            />

            <View className='flex-row gap-3 mt-2 mb-3 align-center'>
                <InputText
                    icon={
                        isPercent ? <FontAwesome6 name="percent" size={18} color={COLORS.placeholder} />
                            : <FontAwesome6 name="money-bill-alt" size={18} color={COLORS.placeholder} />
                    }
                    activeIcon={
                        isPercent ? <FontAwesome6 name="percent" size={18} color={COLORS.primary400} />
                            : <FontAwesome6 name="money-bill-alt" size={18} color={COLORS.primary400} />
                    }
                    placeholder={`Enter discount ${isPercent ? "percent" : "amount"}`}
                    value={discountInput}
                    onChangeText={(t) => { setDiscountInput(t); setErrors(e => ({ ...e, discount: '' })); }}
                    error={errors.discount}
                    keyboardType='numeric'
                    flex={1}
                />

                <IconButton
                    icon={
                        isPercent ? <FontAwesome6 name="percent" size={24} color="white" />
                            : <FontAwesome6 name="money-bill" size={24} color="white" />
                    }
                    onPress={handleToggleType}
                />
            </View>

            <View className="gap-1">
                <InfoField
                    label='Subtotal'
                    value={subtotal.toLocaleString() + " PKR"}
                />

                <InfoField
                    label={`Discount (${discountPercent.toFixed(1).replace(/\.0$/, '')}%)`}
                    value={"- " + discountAmount.toLocaleString() + " PKR"}
                />

                <InfoField
                    label='Total Amount'
                    value={calculatedTotal.toLocaleString() + " PKR"}
                />

                <InfoField
                    label='Received Amount'
                    value={"- " + parsedPaidAmount.toLocaleString() + " PKR"}
                />

                <InfoField
                    label='Pending Due'
                    value={pendingDue.toLocaleString() + " PKR"}
                    valueColor={statusColors[invoice.status]}
                />
            </View>

            <View className='flex-row mt-3 gap-4'>
                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.backBlack} />}
                    label='CANCEL'
                    bgColor='gray'
                    width='flex-1'
                    onPress={onClose}
                />

                <Button
                    leftIcon={<IconWrapper name={ICONS.COMMON.updateOutline} />}
                    label={loading ? 'UPDATING...' : 'UPDATE'}
                    width='flex-1'
                    onPress={handleUpdate}
                />
            </View>
        </CustomeModal>
    );
};

export default EditInvoiceSubtotalModal;