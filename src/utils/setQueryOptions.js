export default function setQueryOptions(query) {

    const { offset, limit, order, desc } = query;

    let queryString = ``;

    if (order) {
        queryString += ` ORDER BY ${order} `;
        if (desc === 'true') {
            queryString += ` DESC `;
        }
    }

    if (offset) {
        queryString += ` OFFSET ${offset} `;
    }

    if (limit) {
        queryString += ` LIMIT ${limit} `;
    }

    return queryString;
}