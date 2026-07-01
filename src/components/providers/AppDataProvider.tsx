import { initializeLocalDatabase } from '@/src/db/client';
import { syncQueueRepository } from '@/src/db/repositories/syncQueueRepository';
import { enqueueExistingLocalMediaUploads } from '@/src/services/mediaBackfillService';
import { startSyncQueueProcessor, stopSyncQueueProcessor } from '@/src/services/syncQueueProcessor';
import { useInvoiceCustomizationStore } from '@/src/store/invoiceCustomizationStore';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

export default function AppDataProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        initializeLocalDatabase()
            .then(async () => {
                await useInvoiceCustomizationStore.getState().hydrateCustomization();
                await enqueueExistingLocalMediaUploads();
                await syncQueueRepository.retryFailedMediaUploads();
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
