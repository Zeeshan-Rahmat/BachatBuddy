import { create } from 'zustand';
import { getInvoiceCustomization, saveInvoiceCustomization } from '../db/repositories/invoiceCustomizationRepository';
import { DEFAULT_CUSTOMIZATION, type FontFamily, type FontSize, type InvoiceCustomization, type InvoiceTemplateId } from '../types/invoice';

export interface InvoiceSignatureDraft {
    label: string;
    dataUri: string;
    updatedAt: number;
}

interface InvoiceCustomizationState {
    customization: InvoiceCustomization;
    signature: InvoiceSignatureDraft | null;
    hasHydrated: boolean;
    hydrateCustomization: () => Promise<void>;
    setTemplateId: (templateId: InvoiceTemplateId) => void;
    setPrimaryColor: (primaryColor: string) => void;
    setFontFamily: (fontFamily: FontFamily) => void;
    setFontSize: (fontSize: FontSize) => void;
    setSignature: (signature: Omit<InvoiceSignatureDraft, 'updatedAt'>) => void;
    clearSignature: () => void;
    resetCustomization: () => void;
}

const toSignatureDraft = (customization: InvoiceCustomization): InvoiceSignatureDraft | null => {
    if (!customization.signature) {
        return null;
    }

    return {
        label: customization.signature.label,
        dataUri: customization.signature.imageUri ?? '',
        updatedAt: Date.now(),
    };
};

const persistCustomization = (customization: InvoiceCustomization): void => {
    void saveInvoiceCustomization(customization).catch((error: unknown) => {
        console.error('Failed to save invoice customization', error);
    });
};

export const useInvoiceCustomizationStore = create<InvoiceCustomizationState>((set) => ({
    customization: DEFAULT_CUSTOMIZATION,
    signature: null,
    hasHydrated: false,

    hydrateCustomization: async () => {
        const customization = await getInvoiceCustomization();
        set({
            customization,
            signature: toSignatureDraft(customization),
            hasHydrated: true,
        });
    },

    setTemplateId: (templateId) => {
        set((state) => {
            const customization = {
                ...state.customization,
                templateId,
            };
            persistCustomization(customization);

            return { customization };
        });
    },

    setPrimaryColor: (primaryColor) => {
        set((state) => {
            const customization = {
                ...state.customization,
                primaryColor,
            };
            persistCustomization(customization);

            return { customization };
        });
    },

    setFontFamily: (fontFamily) => {
        set((state) => {
            const customization = {
                ...state.customization,
                fontFamily,
            };
            persistCustomization(customization);

            return { customization };
        });
    },

    setFontSize: (fontSize) => {
        set((state) => {
            const customization = {
                ...state.customization,
                fontSize,
            };
            persistCustomization(customization);

            return { customization };
        });
    },

    setSignature: (signature) => {
        const nextSignature = {
            label: signature.label,
            imageUri: signature.dataUri,
        };

        set((state) => {
            const customization = {
                ...state.customization,
                signature: nextSignature,
            };
            persistCustomization(customization);

            return {
                customization,
                signature: {
                    ...signature,
                    updatedAt: Date.now(),
                },
            };
        });
    },

    clearSignature: () => {
        set((state) => {
            const customization = {
                ...state.customization,
                signature: null,
            };
            persistCustomization(customization);

            return {
                customization,
                signature: null,
            };
        });
    },

    resetCustomization: () => {
        persistCustomization(DEFAULT_CUSTOMIZATION);
        set({
            customization: DEFAULT_CUSTOMIZATION,
            signature: null,
        });
    },
}));
