import IconWrapper from '@components/common/IconWrapper';
import { View, type ImageSourcePropType } from 'react-native';

interface IconWithBackgroundProps {
    icon: ImageSourcePropType;
}

const IconWithBackground = ({ icon }: IconWithBackgroundProps) => {

    return (
        <View
            className="p-3 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.1)" }}
        >
            <IconWrapper name={icon} />
        </View>
    )
}

export default IconWithBackground