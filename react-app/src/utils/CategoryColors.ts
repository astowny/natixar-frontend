export const COLOR_OPERATION = "#8474E9"
export const COLOR_UPSTREAM = "#FFA06A"
export const COLOR_DOWNSTREAM = "#80D977"
export const COLOR_CLUSTER = "#515F66"

export const getColorByCategory = (category: string): string => {
    let result: string
    switch (category.toLowerCase()) {
        case "operation":
            result = COLOR_OPERATION
            break
        case "upstream":
            result = COLOR_UPSTREAM
            break
        case "downstream":
            result = COLOR_DOWNSTREAM
            break
        default:
            result = COLOR_CLUSTER
            break
    }
    return result
}