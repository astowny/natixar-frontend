const emptyDecimal = ".0";

const amountFormatter = (amount: number): string => {
    const addK = amount >= 1000
    let formattedAmount = (addK ? (amount / 1000) : amount).toFixed(1)
    if (formattedAmount.endsWith(emptyDecimal)) {
        const index = formattedAmount.lastIndexOf(emptyDecimal);
        formattedAmount = formattedAmount.slice(0, index);
    }
    if (addK) formattedAmount += "k"
    return formattedAmount
}

const measureUnits = ["kgCO2eq", "tCO2eq", "ktCO2eq", "MtCO2eq", "GtCO2eq"]
const MEASURE_UNIT_GRADATION = 1000;

const emissionAmountFormatter = (kgCO2eqAmount: number): string => {
    // The logic here is basically same for mg, g, kg, tons
    // Or milliseconds, seconds, minutes, hours and so on.
    // It's just the measurement unit are mass of emissions

    let measureUnitIndex = 0;
    let amount = kgCO2eqAmount
    while (
        measureUnitIndex < (measureUnits.length - 1) // while we are in the array
        && amount >= MEASURE_UNIT_GRADATION // We can pick a bigger measurement
    ) {
        amount /= MEASURE_UNIT_GRADATION
        measureUnitIndex++;
    }

    let formattedAmount = amount.toFixed(1)
    if (formattedAmount.endsWith(emptyDecimal)) {
        // Remove .0, because we don't need it
        const index = formattedAmount.lastIndexOf(emptyDecimal);
        formattedAmount = formattedAmount.slice(0, index);
    }

    return formattedAmount + " " + measureUnits[measureUnitIndex]
}

export const formatAmount = amountFormatter
export const formatEmissionAmount = emissionAmountFormatter
