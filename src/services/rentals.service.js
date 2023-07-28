import db from "../database/db.connection.js";
import dayjs from "dayjs";

import dateDifferenceInDays from "../utils/dateDifferenceInDays.js";

const selectAllFormatedRentals = async () => {

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

    const formatedRentals = rentals.rows.map(rental => ({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
            id: rental.customerId,
            name: rental.customerName
        },
        game: {
            id: rental.gameId,
            name: rental.gameName
        }
    }));

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

const createRental = async (payload) => {

    const {customerId, gameId, rentDate, daysRented, originalPrice } = payload;

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

const updateReturnDateAndDelayFee = async (returnDate, delayFee, id) => {

    await db.query(
        `UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;`
        , [returnDate, delayFee, id]  
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
    selectAllFormatedRentals,
    selectRentalById,
    createRental,
    countRentalGameById,
    updateReturnDateAndDelayFee,
    deleteRentalById
}

export default rentalService;