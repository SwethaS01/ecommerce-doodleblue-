export const CURRENCY = "₹";

export const formatPrice = (value) => `${CURRENCY}${Number(value).toFixed(2)}`;
