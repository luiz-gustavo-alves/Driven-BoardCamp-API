export default function dateDifferenceInDays(date1, date2) {

    const MS_PER_DAY = (1000 * 60 * 60 * 24);
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
}