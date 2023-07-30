export default function formatRentals(rentals) {

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