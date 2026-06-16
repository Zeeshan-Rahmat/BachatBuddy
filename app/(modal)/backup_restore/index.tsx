import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import BackupRestore from './backup-restore';
import BackupRestoreRequests from './backup-restore-request';

const TABS = ['Backup & Restore', 'Backup & Restore Requests'];

const BackupRestoreScreen = () => {

    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [isLoading, setIsLoading] = useState(false);

    // Inside your main screen component file:
    const handleAcceptRequest = (id: string, type: string) => {
        console.log(`Approved ${type} ID: ${id}`);
        // Drop execution handler code here later
    };

    const handleRejectRequest = (id: string, type: string) => {
        console.log(`Disapproved ${type} ID: ${id}`);
        // Drop rejection handler code here later
    };

    // 1. Skeleton Function for Cloud Data Backup
    const handleBackupCurrentData = async () => {
        try {
            setIsLoading(true);
            console.log('Starting cloud data backup sequence...');

            // TODO: Your secure cloud backup API call or Expo-Secure-Store / FileSystem logic here
            // e.g., const response = await uploadBackupToCloud(currentData);

            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            Alert.alert('Backup Successful', 'Your business data has been securely saved to the cloud.');
        } catch (error) {
            console.error('Backup runtime error:', error);
            Alert.alert('Backup Failed', 'Something went wrong while packaging your data.');
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Skeleton Function for Cloud Data Restore
    const handleRestoreFromBackup = async () => {
        try {
            setIsLoading(true);
            console.log('Starting database restoration sequence...');

            // TODO: Fetch backup binary from server, unpack it, and overwrite global local state/DB
            // e.g., await overwriteLocalDatabaseWithBackup(fetchedBackupFile);

            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            Alert.alert('System Restored', 'Your system data has been successfully overwritten and updated.');
        } catch (error) {
            console.error('Restore runtime error:', error);
            Alert.alert('Restore Failed', 'Could not read or parse the remote backup file.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <ScreenWrapper
            title='Backup and Resstore'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>

                {
                    activeTab == TABS[0]
                        ? <BackupRestore
                            handleBackupCurrentData={handleBackupCurrentData}
                            handleRestoreFromBackup={handleRestoreFromBackup}
                            isLoading={isLoading}
                        />

                        : <BackupRestoreRequests
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                        />
                }



            </PaddingWrapper>
        </ScreenWrapper>
    )
}


export default BackupRestoreScreen