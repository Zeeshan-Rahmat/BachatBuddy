import Button from '@/src/components/common/Button';
import Subtitle from '@/src/components/common/Subtitle';
import SectionHeader from '@/src/components/dashboard/SectionHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View } from 'react-native';
import type { BackupSummary } from '@/src/services/backupRestoreService';

interface BackupRestoreProps {
    handleBackupCurrentData: () => void;
    handleRestoreFromBackup: () => void;
    isBackupLoading: boolean;
    isRestoreLoading: boolean;
    lastBackup: BackupSummary | null;
}

const BackupRestore = ({
    handleBackupCurrentData,
    handleRestoreFromBackup,
    isBackupLoading,
    isRestoreLoading,
    lastBackup,
}: BackupRestoreProps) => {
    const lastBackupDate = lastBackup ? formatDate(lastBackup.createdAt) : 'No backup yet';
    const backupSize = lastBackup ? formatBytes(lastBackup.sizeBytes) : '-';

    return (
        <View className='flex-1'>
            <SectionHeader title='Last Backup Detail' marginTop={0} marginBottom={8} hasViewMore={false} fontSize={20} />

            <View className="flex-row justify-between mb-8">

                <LastBackupCard label='Last Backup' value={lastBackupDate} />

                <LastBackupCard label='Storage' value='Cloud Storage' />

                <LastBackupCard label='Backup Size' value={backupSize} />

            </View>


            <View className="mb-8">

                <SectionHeader title='Backup Option' marginTop={0} marginBottom={8} hasViewMore={false} fontSize={20} />

                <Subtitle className='text-left mb-4' text='Save a secure copy of your current business data (including stock, invoices, and customer, supplier, and employee records) to the cloud.' />

                <WarningText text="Note: This will overwrite all the stored cloud backup with the current business data. This action cannot be undone." />

                <Button
                    label='Backup Current Data'
                    onPress={handleBackupCurrentData}
                    leftIcon={<MaterialCommunityIcons name="cloud-upload" size={24} color="white" />}
                    loading={isBackupLoading}
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
                    loading={isRestoreLoading}
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

function formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(timestamp));
}

function formatBytes(bytes: number): string {
    if (bytes <= 0) {
        return '0 KB';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}
