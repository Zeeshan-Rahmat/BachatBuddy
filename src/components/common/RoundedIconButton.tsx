import { ICONS } from '@/src/constants/icons'
import { COLORS } from '@/src/constants/theme'
import IconWrapper from '@components/common/IconWrapper'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const RoundedIconButton = ({ right = 25, bottom = 100, onPress }: { right?: number, bottom?: number, onPress?: () => void }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="absolute w-18 h-18 bg-primary-400 rounded-full items-center justify-center"
            style={
                {
                    right,
                    bottom,

                    elevation: 8,
                    shadowColor: COLORS.placeholder,
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    shadowOffset: { width: 4, height: 4 }
                }
            }
        >
            <IconWrapper name={ICONS.COMMON.plus} size={30} />
        </TouchableOpacity>
    )
}

export default RoundedIconButton