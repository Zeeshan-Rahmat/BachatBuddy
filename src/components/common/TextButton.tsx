import { Text, TouchableOpacity } from 'react-native';

interface TextButtonProps {
    text: string;
    align?: 'self-start' | 'self-center' | 'self-end';
    textstyle?: 'normal' | 'underline';
    onPress: () => void;
    disabled?: boolean;
}

const TextButton = ({ text, align = 'self-start', textstyle, onPress, disabled = false }: TextButtonProps) => {



    return (
        <TouchableOpacity
            className={`${align} mb-5 self`}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Text className={`${disabled ? 'text-gray-400' : 'text-blue-700'} text-textButton font-medium ${textstyle}`}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton
