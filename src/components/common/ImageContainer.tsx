import React from 'react'
import { View, type ImageSourcePropType } from 'react-native'
import IconWrapper from './IconWrapper'

interface ImageContainerProps {
    placeholder: ImageSourcePropType
}

const ImageContainer = ({ placeholder }: ImageContainerProps) => {
    return (
        <View className="w-16 h-16 rounded-button border border-light-100 mr-4 items-center justify-center">
            <IconWrapper name={placeholder} size={30} />
        </View>
    )
}

export default ImageContainer