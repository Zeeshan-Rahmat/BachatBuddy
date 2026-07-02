type LocalDataChangeScope = 'business-data';
type LocalDataChangeListener = (scope: LocalDataChangeScope) => void;

const listeners = new Set<LocalDataChangeListener>();

export function subscribeToLocalDataChanges(listener: LocalDataChangeListener): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function notifyLocalDataChanged(scope: LocalDataChangeScope): void {
    listeners.forEach((listener) => {
        listener(scope);
    });
}
