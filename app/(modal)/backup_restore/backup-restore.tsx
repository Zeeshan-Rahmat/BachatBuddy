import Button from '@/src/components/common/Button';
import Subtitle from '@/src/components/common/Subtitle';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View } from 'react-native';

interface BackupRestoreProps {
    handleBackupCurrentData: () => void;
    handleRestoreFromBackup: () => void;
    isLoading: boolean;
}

const BackupRestore = ({ handleBackupCurrentData, handleRestoreFromBackup, isLoading }: BackupRestoreProps) => {
    return (
        <View className='flex-1'>
            <SectionHeader title='Last Backup Detail' marginTop={0} marginBottom={8} hasViewMore={false} fontSize={20} />

            <View className="flex-row justify-between mb-8">

                <LastBackupCard label='Last Backup' value='20 May 2026' />

                <LastBackupCard label='Storage' value='Cloud Storage' />

                <LastBackupCard label='Backup Size' value='250 MB' />

            </View>


            <View className="mb-8">

                <SectionHeader title='Backup Option' marginTop={0} marginBottom={8} hasViewMore={false} fontSize={20} />

                <Subtitle className='text-left mb-4' text='Save a secure copy of your current business data (including stock, invoices, and customer, supplier, and employee records) to the cloud.' />

                <WarningText text="Note: This will overwrite all the stored cloud backup with the current business data. This action cannot be undone." />

                <Button
                    label='Backup Current Data'
                    onPress={handleBackupCurrentData}
                    leftIcon={<MaterialCommunityIcons name="cloud-upload" size={24} color="white" />}
                    loading={isLoading}
                />
            </View>



            <View>

                <SectionHeader title='Restore Option' marginTop={0} marginBottom={8} hasViewMore={false} fontSize={20} />

                <Subtitle className='text-left mb-4' text='Replace your current system data with a previously saved cloud backup.' />

                <WarningText text='Note: This will overwrite all current records with the data from your backup file. This action cannot be undone.' />

                <Button
                    label='Restore from Backup'
                    onPress={handleRestoreFromBackup}
                    leftIcon={<MaterialCommunityIcons name="database-refresh" size={24} color="white" />}
                    loading={isLoading}
                />
            </View>
        </View>
    )
}


function LastBackupCard({ label, value }: { label: string, value: string }) {
    return (
        <View className="bg-white p-3 rounded-button min-w-[31%]">
            <Text className="text-xs text-dark-50 font-medium mb-1">{label}</Text>
            <Text className="text-[13px] font-semibold text-dark-200" numberOfLines={1}>
                {value}
            </Text>
        </View>
    )
}

function WarningText({ text }: { text: string }) {
    return (
        <Text className="text-sm text-amber-600 font-medium leading-5 mb-4">
            {text}
        </Text>
    )
}


export default BackupRestore