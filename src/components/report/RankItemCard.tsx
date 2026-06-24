import { getStatusColor } from '@/src/Utility/getStatusColor';
import { AnyItemType } from '@/src/types/appTypes';
import ImageContainer from '@components/common/ImageContainer';
import React from 'react';
import { ColorValue, type ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface RankItemCardProps {
    item: AnyItemType;
    placeholder: ImageSourcePropType;
    isProduct?: boolean;
    isCustomer?: boolean;
    isSupplier?: boolean;
    isSelected?: boolean;
    borderColor?: ColorValue;

    onPress?: () => void;
}

const RankItemCard = ({
    item,
    placeholder,
    borderColor,
    isProduct = false,
    isCustomer = false,
    isSupplier = false,
    isSelected,
    onPress
}: RankItemCardProps) => {

    const colors = getStatusColor(item.status);

    // ==========================================
    // EXTRACT VALUES DYNAMICALLY BASED ON ENTITY TYPE
    // ==========================================
    const title = 'name' in item ? item.name : ('invoice_number' in item ? `Invoice #${item.invoice_number}` : 'N/A');

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

            <ImageContainer placeholder={placeholder} image={imageSource} size={48} />

            <View className="flex-1">
                <Text className="text-black font-bold text-base mb-0.5">{title}</Text>

                {isProduct && 'quantity' in item && (
                    <ProductData item={item} colors={{ bg: colors.bg, text: colors.text }} />
                )}

                {isCustomer && (
                    <CustomerData item={item} />
                )}

                {isSupplier && (
                    <PartyData item={item} colors={{ bg: colors.bg, text: colors.text }} />
                )}

            </View>

        </TouchableOpacity>
    );
};

export default RankItemCard;

interface ProductDataProps {
    item: AnyItemType,
    colors: {
        bg: string;
        text: string;
    }
}

function ProductData({ item, colors }: ProductDataProps) {

    const qty = 'quantity' in item && item.quantity;
    const price = 'max_selling_price' in item && item.max_selling_price;
    const soldStock = 'sold_stock' in item && item.sold_stock + " Sold";

    return (
        <View className="flex-row items-center gap-2">
            <Text className="text-dark-300 text-sm">
                <Text className='text-navy-400 font-bold'>{qty}</Text> in Stock
            </Text>
            <Text className="text-dark-50">|</Text>
            <Text className="text-navy-400 font-bold text-sm">
                PKR {price.toLocaleString()}
            </Text>

            <View className={`ml-auto px-2.5 py-1 rounded-button ${colors?.bg || 'bg-dark-50/50'}`}>
                <Text className={`text-xs font-semibold ${colors?.text || 'text-dark-300'}`}>
                    {soldStock}
                </Text>
            </View>
        </View>
    );
}


interface CustomerDataProps {
    item: AnyItemType
}

function CustomerData({ item }: CustomerDataProps) {

    const totalOrders = 'total_orders' in item && item.total_orders;
    const totalPurchases = 'total_purchases' in item && item.total_purchases;
    const pendingDues = 'pending_dues' in item && item.pending_dues;

    const successColors = getStatusColor("Paid");
    const pendingColors = getStatusColor("Pending");

    return (
        <View className="flex-row items-center gap-2">
            <Text className="text-dark-300 text-sm">Purchases:</Text>
            <Text className="text-navy-400 font-bold text-sm">{totalOrders.toLocaleString()}</Text>

            <View className='ml-auto flex-row gap-2'>
                <View className={`px-2.5 py-1 rounded-button ${successColors?.bg || 'bg-dark-50/50'}`}>
                    <Text className={`text-xs font-semibold ${successColors?.text || 'text-dark-300'}`}>
                        {totalPurchases}
                    </Text>
                </View>
                <View className={`px-2.5 py-1 rounded-button ${pendingColors?.bg || 'bg-dark-50/50'}`}>
                    <Text className={`text-xs font-semibold ${pendingColors?.text || 'text-dark-300'}`}>
                        {pendingDues}
                    </Text>
                </View>
            </View>
        </View>
    );
}

interface PartyDataProps {
    item: AnyItemType,
    colors: {
        bg: string;
        text: string;
    }
}

function PartyData({ item, colors }: PartyDataProps) {

    const totalSupplyValue = 'total_supply_value' in item && item.total_supply_value;
    const suppliedProducts = 'supplied_products' in item && item.supplied_products;

    return (
        <View className="flex-row items-center gap-2">
            <Text className="text-dark-300 text-sm">Total Value:</Text>
            <Text className="text-navy-400 font-bold text-sm">PKR {totalSupplyValue.toLocaleString()}</Text>

            <View className={`ml-auto px-2.5 py-1 rounded-button ${colors?.bg || 'bg-dark-50/50'}`}>
                <Text className={`text-xs font-semibold ${colors?.text || 'text-dark-300'}`}>
                    {suppliedProducts} Supplied
                </Text>
            </View>
        </View>
    );
}