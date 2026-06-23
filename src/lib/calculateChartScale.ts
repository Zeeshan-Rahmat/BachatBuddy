import { ChartScaleType } from "../types/appTypes";

interface ChartDataPoint {
    value: number;
    [key: string]: any; // Allows for your label properties or other keys
}

/**
 * Calculates optimized maxValue and noOfSections parameters dynamically 
 * based on the highest value present in the chart data.
 * * @param data Array of chart data points
 * @param targetSections Ideal number of horizontal grid lines wanted (default: 5)
 */
export const calculateChartScale = (
    data: ChartDataPoint[],
    targetSections: number = 5
): ChartScaleType => {
    // 1. Edge case fallback if array data is empty
    if (!data || data.length === 0) {
        return { maxValue: 10000, noOfSections: 5 };
    }

    // 2. Extract the absolute maximum value present in your dataset
    const maxDatasetValue = Math.max(...data.map(item => item.value));

    // 3. Fallback if all values are 0
    if (maxDatasetValue <= 0) {
        return { maxValue: 1000, noOfSections: targetSections };
    }

    // 4. Determine a clean mathematical step size based on magnitude
    // This calculates roughly what each section block interval should represent
    const rawStep = maxDatasetValue / targetSections;

    // Get the magnitude (power of 10) of our raw step size
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalizedStep = rawStep / magnitude;

    // Round up the step to clean human-readable boundaries (e.g., 1, 2, 5, or 10)
    let cleanStep: number;
    if (normalizedStep <= 1) cleanStep = 1;
    else if (normalizedStep <= 2) cleanStep = 2;
    else if (normalizedStep <= 5) cleanStep = 5;
    else cleanStep = 10;

    const finalStepSize = cleanStep * magnitude;

    // 5. Build dynamic outputs based on our computed steps
    const calculatedNoOfSections = Math.ceil(maxDatasetValue / finalStepSize);
    const calculatedMaxValue = calculatedNoOfSections * finalStepSize;

    return {
        maxValue: calculatedMaxValue,
        noOfSections: calculatedNoOfSections
    };
};