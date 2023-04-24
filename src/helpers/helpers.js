export function pluck(objs, key) {
    return objs.map((obj) => obj[key]);
}

export function sumUpConditional (arr, filter) {
    const total = arr.reduce((sum, record) => {
        if(record.owner._id === filter.id && record.category === filter.category) {
            return sum += record.quantity
        }
        return sum
    }, 0)
    return total
}

export function sumUp (arr, argument) {
    const x = arr.reduce((prev, current) => {
        if (current.id === argument) {
            return prev + current.value
        } else {
            return prev
        }
    },0)
    return x
}