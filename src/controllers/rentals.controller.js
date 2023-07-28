import db from "../database/db.connection.js";
import dayjs from "dayjs";

import dateDifferenceInDays from "../utils/dateDifferenceInDays.js";

export const getRentals = async (req, res) => {

    try {
        const rentals = await db.query(
            `SELECT rentals.*,
                TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
                TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
                customers.name AS "customerName",
                games.name AS "gameName"
                FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id;`
        );

        const result = rentals.rows.map(rental => ({
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

        res.send(result);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createRental = async (req, res) => {

    const { customerId, gameId, daysRented } = res.locals.data;

    try {
        const checkValidCustomer = await db.query(
            "SELECT * FROM customers WHERE id = $1;"
            , [customerId]
        );

        const checkValidGame = await db.query(
            "SELECT * FROM games WHERE id = $1;"
            , [gameId]
        );

        if (checkValidCustomer.rowCount < 1 || checkValidGame.rowCount < 1 || checkValidGame.rows[0].stockTotal <= 0) {
            return res.sendStatus(400);
        }

        await db.query(
            `UPDATE games
                SET "stockTotal" = "stockTotal" - 1
                WHERE id = $1;`
            , [gameId]
        );

        const { pricePerDay } = checkValidGame.rows[0];

        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = daysRented * pricePerDay;

        await db.query(
            `INSERT INTO rentals 
                ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7);`
            , [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
        );

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const finishRental = async (req, res) => {

    const { id } = req.params;

    try {
        const checkValidRental = await db.query(
            "SELECT * FROM rentals WHERE id = $1;"
            , [id]
        );

        if (checkValidRental.rowCount < 1) {
            return res.sendStatus(404);
        }

        const { gameId, daysRented, rentDate, returnDate } = checkValidRental.rows[0];
        if (returnDate !== null) {
            return res.sendStatus(400);
        }

        const currentDate = new Date();
        const daysDiff = dateDifferenceInDays(currentDate, new Date(rentDate));

        const gameInQuery = await db.query(
            `SELECT "pricePerDay" FROM games WHERE id = $1;`
            , [gameId]
        );

        const { pricePerDay } = gameInQuery.rows[0];
        const delayFee = (daysDiff > daysRented) ? (pricePerDay * daysDiff) : 0;
    
        await db.query(
            `UPDATE rentals
                SET "returnDate" = $1, "delayFee" = $2
                WHERE id = $3;`
            , [currentDate, delayFee, id]  
        );

        await db.query(
            `UPDATE games
                SET "stockTotal" = "stockTotal" + 1
                WHERE id = $1;`
            , [gameId]
        );

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const deleteRental = async (req, res) => {

    const { id } = req.params;

    try {
        const checkValidRental = await db.query(
            "SELECT * FROM rentals WHERE id = $1;"
            , [id]
        );

        if (checkValidRental.rowCount < 1) {
            return res.sendStatus(404);
        }

        if (checkValidRental.rows[0].returnDate === null) {
            return res.sendStatus(400);
        }

        await db.query(
            "DELETE FROM rentals WHERE id = $1;"
            , [id]
        );

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}