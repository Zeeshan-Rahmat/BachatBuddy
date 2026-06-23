import { ChartScaleType } from "../types/appTypes";

interface ChartDataPoint {
    value: number;
    [key: string]: any;
}

/**
 * Calculates optimized maxValue and noOfSections dynamically across multiple line datasets.
 * @param datasets Array containing multiple data arrays (e.g., [addedStock, soldStock])
 * @param targetSections Ideal number of horizontal grid lines wanted (default: 5)
 */
export const calculateMultiLineChartScale = (
    datasets: ChartDataPoint[][],
    targetSections: number = 5
): ChartScaleType => {
    // 1. Flatten all datasets into a single array of values to find the global peak
    const allValues = datasets.flatMap(dataset => dataset.map(item => item.value));

    if (allValues.length === 0) {
        return { maxValue: 10000, noOfSections: 5 };
    }

    const maxDatasetValue = Math.max(...allValues);

    if (maxDatasetValue <= 0) {
        return { maxValue: 1000, noOfSections: targetSections };
    }

    // 2. Determine a clean mathematical step size based on magnitude
    const rawStep = maxDatasetValue / targetSections;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalizedStep = rawStep / magnitude;

    let cleanStep: number;
    if (normalizedStep <= 1) cleanStep = 1;
    else if (normalizedStep <= 2) cleanStep = 2;
    else if (normalizedStep <= 5) cleanStep = 5;
    else cleanStep = 10;

    const finalStepSize = cleanStep * magnitude;

    // 3. Build dynamic outputs
    const calculatedNoOfSections = Math.ceil(maxDatasetValue / finalStepSize);
    const calculatedMaxValue = calculatedNoOfSections * finalStepSize;

    return {
        maxValue: calculatedMaxValue,
        noOfSections: calculatedNoOfSections
    };
};