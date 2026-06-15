import ImageContainer from '@components/common/ImageContainer';
import React from 'react';
import { type ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ListItemCardProps {
    item: {
        id: string;
        title: string;
        status: string;
        updatedBy: string;
        time: string;
        name?: string;
        city?: string;
        qty?: number;
        price?: number;
        amount?: number;
        email?: string;
    },
    placeholder: ImageSourcePropType;
    image?: ImageSourcePropType;
    isProduct?: boolean;
    isInvoice?: boolean;
    isParty?: boolean;
}

const successColors: { bg: string; text: string } = { bg: 'bg-success/10', text: 'text-success' }
const warningColors: { bg: string; text: string } = { bg: 'bg-warning/10', text: 'text-warning' }
const dangerColors: { bg: string; text: string } = { bg: 'bg-danger/10', text: 'text-danger' }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'In Stock': successColors,
    'Low Stock': warningColors,
    'Out of Stock': dangerColors,
    'Paid': successColors,
    'Pending': warningColors,
    'Unpaid': dangerColors,
};

const ListItemCard = (
    {
        item,
        placeholder,
        image,
        isProduct = false,
        isInvoice = false,
        isParty = false
    }: ListItemCardProps

) => {
    const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS['In Stock'];
    return (
        <TouchableOpacity className="bg-white rounded-button mb-3 p-4 flex-row items-center">


            <ImageContainer placeholder={placeholder} image={image} />

            <View className="flex-1">
                <Text className="text-black font-bold text-base mb-0.5">{item.title}</Text>
                <Text className="text-dark-50 text-xs mb-1.5">
                    Updated by <Text className="font-semibold text-dark-300">{item.updatedBy}</Text> • {item.time}
                </Text>
                <View className="flex-row items-center gap-2">
                    {
                        isProduct && (
                            <ProductData qty={item.qty} price={item.price} />
                        )
                    }
                    {
                        isInvoice && (
                            <>
                                <InvoiceData amount={item.amount} />
                            </>
                        )
                    }
                    {
                        isParty && (
                            <>
                                <PartyData email={item.email} />
                            </>
                        )
                    }
                    <View className={`ml-auto px-2.5 py-1 rounded-button ${colors.bg}`}>
                        <Text className={`text-xs font-semibold ${colors.text}`}>{item.status}</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    )
}


export default ListItemCard;


function ProductData({ qty = 12, price = 1000 }: { qty?: number, price?: number }) {
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
    )
}

function InvoiceData({ amount = 12000 }: { amount?: number }) {
    return (
        <>
            <Text className="text-dark-300 text-sm">Amount: </Text>
            <Text className="text-navy-400 font-bold text-sm">PKR {amount.toLocaleString()}</Text>
        </>
    )
}

function PartyData({ email = "example@mail.com" }: { email?: string }) {
    return (
        <>
            <Text className="text-dark-300 text-xs">{email}</Text>
        </>
    )
}