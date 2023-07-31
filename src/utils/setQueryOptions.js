export default function setQueryOptions(query, tableName) {

    const { offset, limit, order, desc } = query;

    let queryString = ``;

    if (order) {
        queryString += ` ORDER BY ${tableName}.${order} `;
        if (desc) {
            queryString += ` DESC `;
        }
    }

    if (limit) {
        queryString += ` LIMIT ${limit}`;
        if (offset) {
            queryString += ` OFFSET ${offset}`;
        }
    }

    return queryString;
}