import rentalService from "../services/rentals.service.js";
import customerService from "../services/customers.service.js";
import gameService from "../services/games.service.js";
import dayjs from "dayjs";
import dateDifferenceInDays from "../utils/dateDifferenceInDays.js";

export const getRentals = async (req, res) => {

    try {
        const formatedRentals = await rentalService.selectAllFormatedRentals();
        res.send(formatedRentals);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createRental = async (req, res) => {

    const { customerId, gameId, daysRented } = res.locals.data;

    try {
        const customer = await customerService.selectCustomerById(customerId);
        const game = await gameService.selectGameById(gameId);

        if (!customer.rows[0] || !game.rows[0]) {
            return res.sendStatus(400);
        }

        const { pricePerDay, stockTotal } = game.rows[0];

        const rentalGameCount = await rentalService.countRentalGameById(gameId);
        if (rentalGameCount >= stockTotal) {
            return res.sendStatus(400);
        }

        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = daysRented * pricePerDay;

        const payload = {
            customerId: customerId,
            gameId: gameId,
            rentDate: rentDate,
            daysRented: daysRented,
            originalPrice: originalPrice
        }

        await rentalService.createRental(payload);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const finishRental = async (req, res) => {

    const { id } = req.params;

    try {
        const rental = await rentalService.selectRentalById(id);
        if (!rental.rows[0]) {
            return res.sendStatus(404);
        }

        const { gameId, daysRented, rentDate, returnDate } = rental.rows[0];
        if (returnDate !== null) {
            return res.sendStatus(400);
        }

        const currentDate = new Date();
        const daysDiff = dateDifferenceInDays(rentDate, currentDate);
        const game = await gameService.selectGameById(gameId);

        const { pricePerDay } = game.rows[0];
        const delayFee = (daysDiff > daysRented) ? (pricePerDay * (daysDiff - daysRented)) : 0;

        await rentalService.updateReturnDateAndDelayFee(currentDate, delayFee, id);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const deleteRental = async (req, res) => {

    const { id } = req.params;

    try {
        const rental = await rentalService.selectRentalById(id);
        if (!rental.rows[0]) {
            return res.sendStatus(404);
        }

        const { returnDate } = rental.rows[0];
        if (returnDate === null) {
            return res.sendStatus(400);
        }

        await rentalService.deleteRentalById(id);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}