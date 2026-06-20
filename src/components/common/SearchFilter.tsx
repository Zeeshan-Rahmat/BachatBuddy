import { ICONS } from '@/src/constants/icons'
import React from 'react'
import { View } from 'react-native'
import IconButton from '../ui/IconButton'
import IconWrapper from './IconWrapper'
import InputText from './InputText'

interface SearchFilterProps {
    value: string;
    onChangeText: ((text: string) => void) | undefined;
    onFilterPress?: () => void;
}

const SearchFilter = ({ value, onChangeText, onFilterPress }: SearchFilterProps) => {
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
            <IconButton
                icon={<IconWrapper name={ICONS.COMMON.filter} />}
                onPress={onFilterPress}
            />
        </View>
    )
}

export default SearchFilter