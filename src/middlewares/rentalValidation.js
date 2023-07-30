import rentalService from "../services/rentals.service.js";

export const rentalValidation = async (req, res, next) => {

    const { id } = req.params;

    try {
        const rental = await rentalService.selectRentalById(id);

        /* Rental not found */
        if (!rental.rows[0]) {
            return res.sendStatus(404);
        }

        res.locals.rental = rental;
        next();

    } catch (err) {
        res.status(500).send(err.message);
    }
}