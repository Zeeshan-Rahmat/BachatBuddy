import { initializeLocalDatabase } from '@/src/db/client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppDataProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        initializeLocalDatabase()
            .then(() => {
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
        };
    }, []);

    if (!isReady) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator color="#10b981" />
            </View>
        );
    }

    return <>{children}</>;
}
