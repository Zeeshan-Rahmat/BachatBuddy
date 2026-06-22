import { ICONS } from '@/src/constants/icons';
import { InvoiceItemType } from '@/src/types/appTypes';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ImageContainer from '../common/ImageContainer';

interface InvoiceItemCardProps {
    item: InvoiceItemType;
    isSelected?: boolean;

    onPress?: () => void;
}

const InvoiceItemCard = ({
    item,
    isSelected,

    onPress
}: InvoiceItemCardProps
) => {

    const imageSource = item.product.img ? { uri: item.product.img } : undefined;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white rounded-button mb-3 p-4 flex-row items-center 
                ${isSelected === undefined ? "" : isSelected ? "border border-primary-400" : "border border-light-100"}
                `}
        >

            <ImageContainer
                placeholder={ICONS.COMMON.product}
                image={imageSource}
                size={48}
                iconSize={28}
            />

            <View className="flex-1">
                <Text className="text-black font-bold text-base mb-1">{item.product.name}</Text>

                <View className="flex-row justify-between">
                    <Text className='text-dark-100 text-sm'>{item.quantity} x {item.selling_price} PKR</Text>
                    <Text className='text-dark-100 text-sm font-bold'>{item.quantity * item.selling_price} PKR</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default InvoiceItemCard