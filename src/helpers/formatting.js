export const formatCurrency = (value, decimal = 2) => {
    return new Intl.NumberFormat("nl-NL", {minimumFractionDigits: decimal, maximumFractionDigits: decimal}).format(value);
}

export const formatDate = (value) => {
    const day = value.getDate()
    const month = value.getMonth()
    const year = value.getFullYear()
    let format = month + "-" + day + "-" + year;
    return format
}
