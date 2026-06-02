import { Text, TouchableOpacity } from 'react-native';

interface TextButtonProps {
    text: string;
    align?: 'self-start' | 'self-center' | 'self-end';
    textstyle?: 'normal' | 'underline';
    onPress: () => void;
}

const TextButton = ({ text, align = 'self-start', textstyle, onPress }: TextButtonProps) => {



    return (
        <TouchableOpacity
            className={`${align} mb-5 self`}
            onPress={onPress}
        >
            <Text className={`text-blue-700 text-textButton font-medium ${textstyle}`}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton