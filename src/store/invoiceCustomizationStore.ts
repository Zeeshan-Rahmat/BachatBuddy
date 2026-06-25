import { create } from 'zustand';

export interface InvoiceSignatureDraft {
    label: string;
    dataUri: string;
    updatedAt: number;
}

interface InvoiceCustomizationState {
    signature: InvoiceSignatureDraft | null;
    setSignature: (signature: Omit<InvoiceSignatureDraft, 'updatedAt'>) => void;
    clearSignature: () => void;
}

export const useInvoiceCustomizationStore = create<InvoiceCustomizationState>((set) => ({
    signature: null,

    setSignature: (signature) => {
        set({
            signature: {
                ...signature,
                updatedAt: Date.now(),
            },
        });
    },

    clearSignature: () => {
        set({ signature: null });
    },
}));
