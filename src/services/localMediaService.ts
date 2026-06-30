import { Directory, File, Paths } from 'expo-file-system';

const LOCAL_MEDIA_DIR = 'media';

const isPersistedAppMediaUri = (uri: string): boolean => uri.includes(`/${LOCAL_MEDIA_DIR}/`);

const shouldPersistLocalUri = (uri: string): boolean => {
    const normalized = uri.trim().toLowerCase();

    if (!normalized || normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return false;
    }

    if (normalized.startsWith('data:image/')) {
        return false;
    }

    return !isPersistedAppMediaUri(uri);
};

const getExtension = (uri: string): string => {
    const cleanUri = uri.split('?')[0] ?? uri;
    const extension = cleanUri.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();

    return extension || 'jpg';
};

const safeFileNamePart = (value: string): string => value.replace(/[^a-zA-Z0-9_-]/g, '_');

export const persistLocalMedia = (uri: string | null | undefined, folderName: string, recordId: string): string | null => {
    if (!uri || !shouldPersistLocalUri(uri)) {
        return uri ?? null;
    }

    const mediaDir = new Directory(Paths.document, LOCAL_MEDIA_DIR, safeFileNamePart(folderName));
    if (!mediaDir.exists) {
        mediaDir.create({ intermediates: true });
    }

    const extension = getExtension(uri);
    const fileName = `${safeFileNamePart(recordId)}_${Date.now()}.${extension}`;
    const sourceFile = new File(uri);
    const destinationFile = new File(mediaDir, fileName);

    if (destinationFile.exists) {
        destinationFile.delete();
    }

    sourceFile.copy(destinationFile);

    return destinationFile.uri;
};
