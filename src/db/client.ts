import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { migrateLocalDatabase } from './migrations';
import * as schema from './schema';

export const DATABASE_NAME = 'bachatbuddy.db';

export const sqlite = SQLite.openDatabaseSync(DATABASE_NAME, {
    enableChangeListener: true,
});

export const db = drizzle(sqlite, { schema });

let initializationPromise: Promise<void> | null = null;

export const initializeLocalDatabase = (): Promise<void> => {
    initializationPromise ??= migrateLocalDatabase(sqlite);
    return initializationPromise;
};

export type LocalDatabase = typeof db;
