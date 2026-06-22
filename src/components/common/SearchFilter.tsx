import { ICONS } from '@/src/constants/icons'
import React from 'react'
import { View } from 'react-native'
import IconButton from '../ui/IconButton'
import IconWrapper from './IconWrapper'
import InputText from './InputText'

interface SearchFilterProps {
    value: string;
    searchPlaceholder: string;
    hasFilter?: boolean;
    onChangeText: ((text: string) => void) | undefined;
    onFilterPress?: () => void;
}

const SearchFilter = ({ value, searchPlaceholder, hasFilter = true, onChangeText, onFilterPress }: SearchFilterProps) => {
    return (
        <View className="flex-row items-center gap-3">

            <InputText
                icon={<IconWrapper name={ICONS.COMMON.search} />}
                activeIcon={<IconWrapper name={ICONS.COMMON.activeSearch} />}
                placeholder={searchPlaceholder}
                value={value}
                onChangeText={onChangeText}
                bgColor="#fff"
                flex={1}
            />
            {
                hasFilter &&
                <IconButton
                    icon={<IconWrapper name={ICONS.COMMON.filter} />}
                    onPress={onFilterPress}
                />
            }
        </View>
    )
}

export default SearchFilter