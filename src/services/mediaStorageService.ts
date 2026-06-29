import { supabase } from '@/src/lib/supabase';
import { File } from 'expo-file-system';

type SyncableMediaTable =
    | 'users'
    | 'employees'
    | 'customers'
    | 'suppliers'
    | 'products'
    | 'invoices';

type MediaFieldName = 'img' | 'business_logo';

type RemotePayload = Record<string, unknown>;
type UploadableImageBody = Blob | ArrayBuffer;

type PreparedImageUpload = {
    body: UploadableImageBody;
    contentType: string;
};

const MEDIA_BUCKET_BY_FIELD: Record<MediaFieldName, string> = {
    img: 'bachatbuddy-media',
    business_logo: 'bachatbuddy-media',
};

const MEDIA_FIELDS_BY_TABLE: Record<SyncableMediaTable, MediaFieldName[]> = {
    users: ['img', 'business_logo'],
    employees: ['img', 'business_logo'],
    customers: ['img'],
    suppliers: ['img'],
    products: ['img'],
    invoices: ['img'],
};

const REMOTE_MEDIA_URL_PREFIX = '/storage/v1/object/public/';
const DEFAULT_IMAGE_CONTENT_TYPE = 'image/jpeg';

function isSyncableMediaTable(tableName: string): tableName is SyncableMediaTable {
    return tableName in MEDIA_FIELDS_BY_TABLE;
}

function isUploadableLocalUri(value: unknown): value is string {
    if (typeof value !== 'string') {
        return false;
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return false;
    }

    return normalized.startsWith('file://')
        || normalized.startsWith('content://')
        || normalized.startsWith('ph://')
        || normalized.startsWith('assets-library://')
        || normalized.startsWith('data:image/');
}

function getFileExtension(uri: string, contentType: string): string {
    const pathWithoutQuery = uri.split('?')[0] ?? uri;
    const extensionMatch = pathWithoutQuery.match(/\.([a-zA-Z0-9]+)$/);

    if (extensionMatch?.[1]) {
        return extensionMatch[1].toLowerCase();
    }

    if (contentType === 'image/png') {
        return 'png';
    }

    if (contentType === 'image/webp') {
        return 'webp';
    }

    if (contentType === 'image/gif') {
        return 'gif';
    }

    if (contentType === 'image/heic') {
        return 'heic';
    }

    if (contentType === 'image/heif') {
        return 'heif';
    }

    return 'jpg';
}

function buildStoragePath(tableName: SyncableMediaTable, recordId: string, fieldName: MediaFieldName, extension: string): string {
    return `${tableName}/${recordId}/${fieldName}.${extension}`;
}

function isSupabasePublicStorageUrl(value: string): boolean {
    return value.includes(REMOTE_MEDIA_URL_PREFIX);
}

function normalizeImageContentType(contentType: string | null | undefined, uri: string): string {
    const normalized = contentType?.split(';')[0]?.trim().toLowerCase();

    if (normalized === 'image/jpg' || normalized === 'image/pjpeg') {
        return DEFAULT_IMAGE_CONTENT_TYPE;
    }

    if (normalized?.startsWith('image/')) {
        return normalized;
    }

    const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        case 'gif':
            return 'image/gif';
        case 'heic':
            return 'image/heic';
        case 'heif':
            return 'image/heif';
        default:
            return DEFAULT_IMAGE_CONTENT_TYPE;
    }
}

async function prepareImageUploadBody(uri: string): Promise<PreparedImageUpload> {
    if (uri.trim().toLowerCase().startsWith('data:image/')) {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error('Unable to read selected image data.');
        }

        const blob = await response.blob();
        return {
            body: blob,
            contentType: normalizeImageContentType(blob.type, uri),
        };
    }

    const file = new File(uri);
    const body = await file.arrayBuffer();

    return {
        body,
        contentType: normalizeImageContentType(file.type, uri),
    };
}

async function uploadImageUri(
    tableName: SyncableMediaTable,
    recordId: string,
    fieldName: MediaFieldName,
    uri: string
): Promise<string> {
    if (isSupabasePublicStorageUrl(uri)) {
        return uri;
    }

    const { body, contentType } = await prepareImageUploadBody(uri);
    const extension = getFileExtension(uri, contentType);
    const bucket = MEDIA_BUCKET_BY_FIELD[fieldName];
    const path = buildStoragePath(tableName, recordId, fieldName, extension);
    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, body, {
            contentType,
            upsert: true,
        });

    if (error) {
        throw new Error(`Unable to upload image for ${tableName}.${fieldName}: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function prepareRemotePayloadMedia(
    tableName: string,
    recordId: string,
    payload: RemotePayload
): Promise<RemotePayload> {
    if (!isSyncableMediaTable(tableName)) {
        return payload;
    }

    const mediaFields = MEDIA_FIELDS_BY_TABLE[tableName];
    let nextPayload: RemotePayload | null = null;

    for (const fieldName of mediaFields) {
        const value = payload[fieldName];

        if (!isUploadableLocalUri(value)) {
            continue;
        }

        const remoteUrl = await uploadImageUri(tableName, recordId, fieldName, value);
        nextPayload = nextPayload ?? { ...payload };
        nextPayload[fieldName] = remoteUrl;
    }

    return nextPayload ?? payload;
}
