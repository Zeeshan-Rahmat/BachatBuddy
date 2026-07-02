import { initializeLocalDatabase } from '@/src/db/client';
import { syncQueueRepository } from '@/src/db/repositories/syncQueueRepository';
import { employeeDataSyncService } from '@/src/services/employeeDataSyncService';
import { notifyLocalDataChanged } from '@/src/services/localDataChangeNotifier';
import { enqueueExistingLocalMediaUploads } from '@/src/services/mediaBackfillService';
import { startSyncQueueProcessor, stopSyncQueueProcessor } from '@/src/services/syncQueueProcessor';
import { useAuthStore } from '@/src/store/authStore';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

export default function AppDataProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const user = useAuthStore((state) => state.user);
    const lastEmployeePullKeyRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        initializeLocalDatabase()
            .then(async () => {
                await useInvoiceCustomizationStore.getState().hydrateCustomization();
                await enqueueExistingLocalMediaUploads();
                await syncQueueRepository.retryFailedMediaUploads();
                await syncQueueRepository.retryFailedEntries();
                startSyncQueueProcessor();
                if (isMounted) {
                    setIsReady(true);
                }
            })
            .catch((error: unknown) => {
                console.error('Failed to initialize local database', error);
                if (isMounted) {
                    setIsReady(true);
                }
            });

        return () => {
            isMounted = false;
            stopSyncQueueProcessor();
        };
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'employee' || !user.businessId) {
            return;
        }

        let isMounted = true;
        let isReconciling = false;

        const reconcileApprovedDownload = async () => {
            if (isReconciling) {
                return;
            }

            isReconciling = true;
            try {
                const result = await employeeDataSyncService.reconcileApprovedPull(user);

                if (!isMounted || !result.success || result.data.status !== 'approved') {
                    return;
                }

                const pulledTotal = Object.values(result.data.pulledCounts).reduce((sum, count) => sum + count, 0);
                const pullKey = `${user.id}:${result.data.requestId ?? 'latest'}:${pulledTotal}`;

                if (pulledTotal > 0 && lastEmployeePullKeyRef.current !== pullKey) {
                    lastEmployeePullKeyRef.current = pullKey;
                    console.info('[EmployeeDataSync] Approved business data pulled into SQLite.', result.data.pulledCounts);
                    notifyLocalDataChanged('business-data');
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                console.warn('[EmployeeDataSync] Approved business data reconcile failed:', message);
            } finally {
                isReconciling = false;
            }
        };

        void reconcileApprovedDownload();
        const intervalId = setInterval(() => {
            void reconcileApprovedDownload();
        }, 30_000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [user]);

    if (!isReady) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Image
                    source={require('../../../assets/images/logo.png')}
                    className="w-28 h-28 mb-5"
                    resizeMode="contain"
                />
                <ActivityIndicator color="#10b981" />
                <Text className="text-slate-500 text-sm font-semibold mt-3">
                    Loading BachatBuddy
                </Text>
            </View>
        );
    }

    return <>{children}</>;
}
