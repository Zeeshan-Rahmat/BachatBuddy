type SyncQueueRequestHandler = () => void;

let requestHandler: SyncQueueRequestHandler | null = null;
let scheduled = false;

export function setSyncQueueRequestHandler(handler: SyncQueueRequestHandler | null): void {
    requestHandler = handler;
}

export function requestSyncQueueProcessing(): void {
    if (scheduled) {
        return;
    }

    scheduled = true;
    setTimeout(() => {
        scheduled = false;
        requestHandler?.();
    }, 0);
}
