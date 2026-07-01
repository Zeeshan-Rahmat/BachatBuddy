import InternalTabBar from '@/src/components/common/InternalTabBar';
import PaddingWrapper from '@/src/components/common/PaddingWrapper';
import ScreenWrapper from '@/src/components/layout/ScreenWrapper';
import { approvalWorkflowService, type ApprovalRequest } from '@/src/services/approvalWorkflowService';
import { backupRestoreService, type BackupSummary } from '@/src/services/backupRestoreService';
import { useAuthStore } from '@/src/store/authStore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import BackupRestore from './backup-restore';
import BackupRestoreRequests from './backup-restore-request';

const TABS = ['Backup & Restore', 'Approval Requests'];

const BackupRestoreScreen = () => {

    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [lastBackup, setLastBackup] = useState<BackupSummary | null>(null);
    const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
    const [isLoadingApprovals, setIsLoadingApprovals] = useState(false);
    const [activeApprovalId, setActiveApprovalId] = useState<string | null>(null);
    const user = useAuthStore((state) => state.user);
    const businessId = useMemo(() => user?.businessId ?? user?.id ?? null, [user?.businessId, user?.id]);

    const loadLastBackup = useCallback(async () => {
        if (!businessId) {
            setLastBackup(null);
            return;
        }

        const metadata = await backupRestoreService.getLastBackup(businessId);
        setLastBackup(metadata
            ? {
                backupId: metadata.backupId,
                storagePath: metadata.storagePath,
                createdAt: metadata.createdAt,
                sizeBytes: metadata.sizeBytes,
                recordCounts: metadata.recordCounts as BackupSummary['recordCounts'],
            }
            : null);
    }, [businessId]);

    useEffect(() => {
        void loadLastBackup();
    }, [loadLastBackup]);

    const loadApprovalRequests = useCallback(async () => {
        if (user?.role !== 'owner') {
            setApprovalRequests([]);
            return;
        }

        setIsLoadingApprovals(true);
        const result = await approvalWorkflowService.listPendingRequests();
        setIsLoadingApprovals(false);

        if (!result.success) {
            Alert.alert('Approval Requests Failed', result.error);
            return;
        }

        setApprovalRequests(result.data);
    }, [user?.role]);

    useEffect(() => {
        if (activeTab === TABS[1]) {
            void loadApprovalRequests();
        }
    }, [activeTab, loadApprovalRequests]);

    const handleAcceptRequest = async (id: string) => {
        if (!user) {
            Alert.alert('Approval Failed', 'Please sign in before reviewing requests.');
            return;
        }

        setActiveApprovalId(id);
        const result = await approvalWorkflowService.approveRequest(id, user.id);
        setActiveApprovalId(null);

        if (!result.success) {
            Alert.alert('Approval Failed', result.error);
            return;
        }

        setApprovalRequests((requests) => requests.filter((request) => request.id !== id));
        Alert.alert('Request Approved', 'The employee change has been approved and synced to the cloud.');
    };

    const handleRejectRequest = async (id: string) => {
        if (!user) {
            Alert.alert('Rejection Failed', 'Please sign in before reviewing requests.');
            return;
        }

        setActiveApprovalId(id);
        const result = await approvalWorkflowService.rejectRequest(id, user.id);
        setActiveApprovalId(null);

        if (!result.success) {
            Alert.alert('Rejection Failed', result.error);
            return;
        }

        setApprovalRequests((requests) => requests.filter((request) => request.id !== id));
        Alert.alert('Request Rejected', 'The employee change has been rejected.');
    };

    // 1. Skeleton Function for Cloud Data Backup
    const handleBackupCurrentData = async () => {
        if (!user || !businessId) {
            Alert.alert('Backup Failed', 'Please sign in before creating a cloud backup.');
            return;
        }

        try {
            setIsBackingUp(true);
            const result = await backupRestoreService.backupCurrentData(user.id, businessId);

            if (!result.success || !result.data) {
                Alert.alert('Backup Failed', result.error ?? 'Something went wrong while packaging your data.');
                return;
            }

            setLastBackup(result.data);
            if (result.upToDate) {
                Alert.alert('Backup Up to Date', 'Your local data has no changes since the last cloud backup.');
                return;
            }

            Alert.alert('Backup Successful', 'Your business data has been securely saved to the cloud.');
        } catch (error) {
            console.error('Backup runtime error:', error);
            Alert.alert('Backup Failed', 'Something went wrong while packaging your data.');
        } finally {
            setIsBackingUp(false);
        }
    };

    // 2. Skeleton Function for Cloud Data Restore
    const handleRestoreFromBackup = async () => {
        if (!user || !businessId) {
            Alert.alert('Restore Failed', 'Please sign in before restoring a cloud backup.');
            return;
        }

        Alert.alert(
            'Restore from Backup',
            'This will overwrite the current local database with the latest cloud backup.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Restore',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsRestoring(true);
                            const result = await backupRestoreService.restoreLatestBackup(user.id, businessId);

                            if (!result.success || !result.data) {
                                Alert.alert('Restore Failed', result.error ?? 'Could not read or parse the remote backup file.');
                                return;
                            }

                            setLastBackup(result.data);
                            Alert.alert('System Restored', 'Your system data has been successfully overwritten and updated.');
                        } catch (error) {
                            console.error('Restore runtime error:', error);
                            Alert.alert('Restore Failed', 'Could not read or parse the remote backup file.');
                        } finally {
                            setIsRestoring(false);
                        }
                    },
                },
            ]
        );
    };



    return (
        <ScreenWrapper
            title='Backup and Restore'
            leftIcon='back'
            rightIcons='none'
            scrollable={false}
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <InternalTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

            <PaddingWrapper>

                {
                    activeTab === TABS[0]
                        ? <BackupRestore
                            handleBackupCurrentData={handleBackupCurrentData}
                            handleRestoreFromBackup={handleRestoreFromBackup}
                            isBackupLoading={isBackingUp}
                            isRestoreLoading={isRestoring}
                            lastBackup={lastBackup}
                        />

                        : <BackupRestoreRequests
                            requests={approvalRequests}
                            loading={isLoadingApprovals}
                            activeRequestId={activeApprovalId}
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                            onRefresh={loadApprovalRequests}
                        />
                }



            </PaddingWrapper>
        </ScreenWrapper>
    )
}


export default BackupRestoreScreen
