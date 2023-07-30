import rentalService from "../services/rentals.service.js";
import customerService from "../services/customers.service.js";
import gameService from "../services/games.service.js";

export const getRentals = async (req, res) => {

    const queryLength = Object.keys(req.query).length;

    try {
        const rentals = (queryLength >= 1) ?
            await rentalService.selectRentalsByQuery(req.query)
            :
            await rentalService.selectAllRentals();

        res.send(rentals);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const createRental = async (req, res) => {

    const { customerId, gameId } = res.locals.data;

    try {
        const customer = await customerService.selectCustomerById(customerId);
        const game = await gameService.selectGameById(gameId);

        /* Check valid customer/game ID */
        if (!customer.rows[0] || !game.rows[0]) {
            return res.sendStatus(400);
        }

        const { pricePerDay, stockTotal } = game.rows[0];
        const rentalGameCount = await rentalService.countRentalGameById(gameId);

        /* Check if game is available for rental */
        if (rentalGameCount >= stockTotal) {
            return res.sendStatus(400);
        }

        await rentalService.createRental(res.locals.data, pricePerDay);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const finishRental = async (req, res) => {

    const { id } = req.params;
    const rental = res.locals.rental;

    const { gameId, returnDate } = rental.rows[0];
    /* Trying to finish a rental that is already finished */
    if (returnDate !== null) {
        return res.sendStatus(400);
    }

    try {
        const game = await gameService.selectGameById(gameId);
        const { pricePerDay } = game.rows[0];

        await rentalService.updateReturnDateAndDelayFee(rental.rows[0], pricePerDay, id);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export const deleteRental = async (req, res) => {

    const { id } = req.params;
    const rental = res.locals.rental;

    const { returnDate } = rental.rows[0];

    /* Trying to delete a rental that is not finished yet */
    if (returnDate === null) {
        return res.sendStatus(400);
    }

    try {
        await rentalService.deleteRentalById(id);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}