import { getRelativeTimeShort } from '@/src/Utility/DateFunctions';
import { getStatusColor } from '@/src/Utility/getStatusColor';
import { AnyItemType } from '@/src/types/appTypes';
import ImageContainer from '@components/common/ImageContainer';
import React from 'react';
import { ColorValue, type ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ListItemCardProps {
    item: AnyItemType;
    placeholder: ImageSourcePropType;
    isProduct?: boolean;
    isInvoice?: boolean;
    isParty?: boolean;
    isSelected?: boolean;
    borderColor?: ColorValue;

    onPress?: () => void;
}

const ListItemCard = ({
    item,
    placeholder,
    borderColor,
    isProduct = false,
    isInvoice = false,
    isParty = false,
    isSelected,
    onPress
}: ListItemCardProps) => {

    const colors = getStatusColor(item.status);

    // ==========================================
    // EXTRACT VALUES DYNAMICALLY BASED ON ENTITY TYPE
    // ==========================================
    const title = 'name' in item ? item.name : ('invoice_number' in item ? `Invoice #${item.invoice_number}` : 'N/A');

    // Safely extract creator/updater info depending on object hierarchy
    const updatedBy = 'last_updated_by' in item ? item.last_updated_by.name : 'System';

    // Format timestamp string safely
    const formattedTime = getRelativeTimeShort(item.last_updated_at);

    // Use specific item image uri if available, fallback to required asset placeholder
    const imageSource = item.img ? { uri: item.img } : undefined;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white rounded-button mb-3 p-4 flex-row items-center 
                ${isSelected === undefined ? "" : isSelected ? "border border-primary-400" : "border border-light-100"} 
                ${borderColor && "border"}
                `}
            style={{ borderColor: borderColor }}
        >

            <ImageContainer placeholder={placeholder} image={imageSource} />

            <View className="flex-1">
                <Text className="text-black font-bold text-base mb-0.5">{title}</Text>

                <Text className="text-dark-50 text-xs mb-1.5">
                    Updated by <Text className="font-semibold text-dark-300">{updatedBy}</Text> • {formattedTime}
                </Text>

                <View className="flex-row items-center gap-2">
                    {isProduct && 'quantity' in item && (
                        <ProductData qty={item.quantity} price={item.max_selling_price} />
                    )}

                    {isInvoice && 'total_amount' in item && (
                        <InvoiceData amount={item.total_amount} />
                    )}

                    {isParty && 'email' in item && (
                        <PartyData email={item.email} />
                    )}

                    <View className={`ml-auto px-2.5 py-1 rounded-button ${colors?.bg || 'bg-gray-100'}`}>
                        <Text className={`text-xs font-semibold ${colors?.text || 'text-gray-700'}`}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    );
};

export default ListItemCard;

// ==========================================
// SUB-COMPONENTS (With matching DB property types)
// ==========================================

function ProductData({ qty = 0, price = 0 }: { qty?: number; price?: number }) {
    return (
        <>
            <Text className="text-dark-300 text-sm">
                <Text className='text-navy-400 font-bold'>{qty}</Text> in Stock
            </Text>
            <Text className="text-dark-50">|</Text>
            <Text className="text-navy-400 font-bold text-sm">
                PKR {price?.toLocaleString()}
            </Text>
        </>
    );
}

function InvoiceData({ amount = 0 }: { amount?: number }) {
    return (
        <>
            <Text className="text-dark-300 text-sm">Amount: </Text>
            <Text className="text-navy-400 font-bold text-sm">PKR {amount.toLocaleString()}</Text>
        </>
    );
}

function PartyData({ email = "example@mail.com" }: { email?: string }) {
    return (
        <>
            <Text className="text-dark-300 text-xs flex-1" numberOfLines={1}>
                {email}
            </Text>
        </>
    );
}
