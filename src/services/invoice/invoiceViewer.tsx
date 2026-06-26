import { COLORS } from '@/src/constants/theme';
import { generateInvoiceHtml } from '@/src/templates/invoiceTemplate';
import { InvoiceCustomization, InvoiceData } from '@/src/types/invoice';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { generateInvoicePdf } from './pdfService';

interface InvoiceViewer {
    invoiceData: InvoiceData
    customization: InvoiceCustomization
}

export default function InvoiceViewer({ invoiceData, customization }: InvoiceViewer) {
    const [pdfUri, setPdfUri] = useState<string | null>(null);

    useEffect(() => {
        // Only generate the PDF file if the user is on iOS
        if (Platform.OS === 'ios') {
            async function loadPdf() {
                const uri = await generateInvoicePdf(invoiceData, customization);
                setPdfUri(uri);
            }
            loadPdf();
        }
    }, [invoiceData]);

    // Fallback loading indicator for iOS while file compiles
    if (Platform.OS === 'ios' && !pdfUri) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.navy400} />
            </View>
        );
    }

    // Platform conditional source selection
    // iOS reads the rendered file URI, Android reads the raw text string cleanly.
    const webViewSource = Platform.OS === 'ios'
        ? { uri: pdfUri! }
        : { html: generateInvoiceHtml(invoiceData, customization) };

    return (
        <WebView
            style={{ flex: 1 }} // Safer than className for cross-platform layout rendering
            originWhitelist={['*']}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            scalesPageToFit={true}
            scrollEnabled={true}
            source={webViewSource}
        />
    );
}