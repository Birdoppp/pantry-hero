export function formatAmount(amount) {
    if ( typeof amount !== "number" ) {
        const parsedAmount = parseFloat(amount);

        if (!isNaN(parsedAmount)) {
            amount = parsedAmount;
        } else {
            return NaN;
        }
    }

    return Math.round(amount * 100) / 100;
}