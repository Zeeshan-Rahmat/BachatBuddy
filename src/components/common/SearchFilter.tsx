import { ICONS } from '@/src/constants/icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import IconWrapper from './IconWrapper'
import InputText from './InputText'

interface SearchFilterProps {
    value: string;
    onChangeText: ((text: string) => void) | undefined;
}

const SearchFilter = ({ value, onChangeText }: SearchFilterProps) => {
    return (
        <View className="flex-row items-center gap-3">

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.search} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activeSearch} />}
                placeholder="Search Items"
                value={value}
                onChangeText={onChangeText}
                bgColor="#fff"
                flex={1}
            />
            <TouchableOpacity className="mb-4 w-14 h-14 bg-primary-400 rounded-button items-center justify-center">
                <IconWrapper name={ICONS.COMMON.filter} />
            </TouchableOpacity>
        </View>
    )
}

export default SearchFilter