import db from "../database/db.connection.js";
import dayjs from "dayjs";
import dateDifferenceInDays from "../utils/dateDifferenceInDays.js";
import formatRentals from "../utils/formatRentals.js";
import setQueryOptions from "../utils/setQueryOptions.js";

const selectAllRentals = async () => {

    const rentals = await db.query(
        `SELECT rentals.*,
            TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
            TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
            customers.name AS "customerName",
            games.name AS "gameName"
        FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id;
        `
    );

    const formatedRentals = formatRentals(rentals);
    return formatedRentals;
}

const selectRentalsByQuery = async (query) => {

    const { customerId, gameId, status, startDate } = query;

    const tableName = "rentals";
    let queryString = `
        SELECT rentals.*,
            TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
            TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
            customers.name AS "customerName",
            games.name AS "gameName"
        FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
    `;

    if (customerId) {
        queryString += ` WHERE "customerId" = ${customerId} `;
    }

    if (gameId) {
        queryString += queryString.includes("WHERE") ? " AND " : " WHERE ";
        queryString += `"gameId" = ${gameId} `;
    }

    if (status) {
        queryString += queryString.includes("WHERE") ? " AND " : " WHERE ";

        if (status === 'open') {
            queryString += `"returnDate" IS null `;
    
        } else if (status === 'closed') {
            queryString += `"returnDate" IS NOT null `;
        }
    }

    if (startDate) {
        queryString += queryString.includes("WHERE") ? " AND " : " WHERE ";
        queryString += `"rentDate" >= '${startDate}'::date `;
    }

    queryString += setQueryOptions(query, tableName);
    const rentals = await db.query(queryString, []);

    const formatedRentals = formatRentals(rentals);
    return formatedRentals;
}

const selectRentalById = async (id) => {

    const rental = await db.query(
        `SELECT * 
            FROM rentals 
            WHERE id = $1;
        `, [id]
    );

    return rental;
}

const createRental = async (payload, pricePerDay) => {

    const {customerId, gameId, daysRented } = payload;

    const rentDate = dayjs().format('YYYY-MM-DD');
    const originalPrice = daysRented * pricePerDay;

    await db.query(
        `INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );
}

const countRentalGameById = async (id) => {

    const rentalGameCount = await db.query(
        `SELECT COUNT(*) 
            FROM rentals 
            WHERE "gameId" = $1 AND "returnDate" IS NULL;
        `, [id]
    );

    return rentalGameCount.rows[0].count;
}

const updateReturnDateAndDelayFee = async (payload, pricePerDay, id) => {

    const { rentDate, daysRented } = payload;

    const currentDate = new Date();
    const daysDiff = dateDifferenceInDays(rentDate, currentDate);
    const delayFee = (daysDiff > daysRented) ? (pricePerDay * (daysDiff - daysRented)) : 0;

    await db.query(
        `UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;`
        , [currentDate, delayFee, id]  
    );
}

const deleteRentalById = async (id) => {

    await db.query(
        `DELETE 
            FROM rentals
            WHERE id = $1;
        `, [id]
    );
}

const rentalService = {
    selectAllRentals,
    selectRentalsByQuery,
    selectRentalById,
    createRental,
    countRentalGameById,
    updateReturnDateAndDelayFee,
    deleteRentalById
}

export default rentalService;